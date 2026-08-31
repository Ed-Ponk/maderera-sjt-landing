# Notas de deploy — subdominio admin

## 1. También el bloque del dominio principal necesita client_max_body_size

madererasjt.com/admin sigue existiendo y sirve subidas. Si el server block
principal no define `client_max_body_size`, Nginx responde 413 antes que la app.
Agregar dentro del bloque `server_name madererasjt.com;`:

    client_max_body_size 6M;

## 2. SSL

    certbot --nginx -d madererasjt.com -d admin.madererasjt.com

(con los server blocks creados primero). Mantener X-Forwarded-Proto y
AUTH_TRUST_HOST=true (ya está en .env) para que Auth.js respete el esquema https.

## 3. Variables de entorno

- ADMIN_HOST="admin.madererasjt.com" ya agregado a .env. El middleware lo lee
  en build-time (inlining en edge), con fallback al mismo valor si faltara.
- AUTH_URL debe apuntar al sitio público real en producción
  (https://madererasjt.com), no a http://localhost:3100.

## 4. Verificación en VPS

    curl -H "Host: admin.madererasjt.com" -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/login   # 200
    curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/catalogo                                    # 200
