# CHECKLIST — pasos manuales de deploy (requieren acceso SSH real al VPS)

Consolidación de todos los pasos que NO se pueden hacer desde el repo y quedaron
documentados en distintas respuestas. Marcar cada uno al ejecutarlo el día del deploy.

## DNS
- [ ] Crear registro A para `admin.madererasjt.com` apuntando al mismo VPS que `madererasjt.com`.
      Verificar: `getent hosts madererasjt.com admin.madererasjt.com`

## Nginx
- [ ] Copiar los server blocks al VPS:
      - `deploy/nginx/madererasjt.com.conf` (sitio principal) → `/etc/nginx/sites-available/`
      - `deploy/nginx/admin.madererasjt.com.conf` (subdominio admin) → `/etc/nginx/sites-available/`
      Si ya existen server blocks propios, MERGE: agregar `client_max_body_size 6M;`
      (server scope) al bloque del dominio principal — sin esto Nginx responde 413
      antes que la app para imágenes cercanas a 5MB subidas por `/admin/*`.
- [ ] `sudo nginx -t && sudo systemctl reload nginx`

## TLS (certbot)
- [ ] `sudo certbot --nginx -d madererasjt.com -d admin.madererasjt.com`
      (asegurar X-Forwarded-Proto y `AUTH_TRUST_HOST=true` ya presente en .env).

## Variables de entorno (app)
- [ ] `NEXT_PUBLIC_SITE_URL` debe apuntar al dominio real de producción
      (ej. `https://madererasjt.com`), NUNCA a `http://localhost:3000`.
      Se usa en metadata base, canonical, Open Graph y sitemap — con localhost
      todos los links SEO saldrían rotos. Verificar en el `.env` del contenedor
      antes de iniciar.
- [ ] `AUTH_URL` debe apuntar al sitio público real: `https://madererasjt.com`
      (en .env local queda `http://localhost:3100` para desarrollo).
- [ ] `ADMIN_HOST="admin.madererasjt.com"` presente en el .env del contenedor
      (el middleware lo lee en build-time, con fallback al mismo valor).

## Base de datos: decisión SQLite vs Postgres
- Decisión: **se usa SQLite en producción** (no Postgres). El `docker-compose.yml`
  trae un servicio postgres de referencia para una migración futura, pero NO es
  el motor activo.
- Justificación: tráfico bajo (landing de 3 sedes), `next start` en
  single-process (sin PM2 cluster), escrituras solo desde el panel admin
  (bajo volumen), y las lecturas públicas mayormente servidas por ISR.

### Checklist de mitigación
- [ ] `prisma/prod.db` (o `DB_PATH`) con permisos **600** en el VPS
      (`chmod 600 <ruta>` post-deploy).
- [ ] Archivo de base fuera de `/public` (ya cumplido: se sirve vía
      `IMAGES_ROOT`/rutas internas, no desde el árbol público).
- [ ] Cron de backup activo: `scripts/backup-db.sh` vía
      `deploy/cron/madererasjt-backup` (3:00 AM diario, retención 14 días).
- [ ] Retención de 14 días verificada (`find backups/ -name 'prod-*.db' -mtime +14`).

### Trigger de migración a Postgres (revisar en el futuro, no ahora)
- Migrar si se agrega **PM2 en modo cluster** o múltiples procesos Node
  sirviendo la app.
- Migrar si aparecen **escrituras concurrentes frecuentes desde el público**
  (no solo desde el panel admin).
- Nota: si se migra, **falta crear un Dockerfile** — `docker-compose.yml`
  referencia `build: .` pero no existe Dockerfile en el repo todavía.

## Verificación post-deploy
- [ ] Subida real ~4.8MB vía `madererasjt.com/admin` NO debe devolver 413
      (esperar 401/307 sin sesión, que es el flujo normal de auth).
- [ ] Subida real ~4.8MB vía `admin.madererasjt.com/admin` NO debe devolver 413.
- [ ] `curl -H "Host: admin.madererasjt.com" http://127.0.0.1:3000/login` → 200
- [ ] `curl http://127.0.0.1:3000/robots.txt` incluye `Disallow: /admin`
- [ ] `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/catalogo` → 200
- [ ] Login en `madererasjt.com/admin` y en `admin.madererasjt.com` (flujo completo).
