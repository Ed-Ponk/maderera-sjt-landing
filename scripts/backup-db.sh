#!/usr/bin/env bash
#
# backup-db.sh — Backup seguro de la base SQLite de Maderera San Judas Tadeo.
#
# CONFIGURACIÓN
#   DB_PATH      Ruta al archivo SQLite. En desarrollo/local fallback a
#                prisma/dev.db; en producción apuntar a la ruta real del VPS
#                (ej. /var/lib/maderera-sjt/prod.db). La app la lee desde
#                DATABASE_URL; este script usa DB_PATH para no depender del
#                formato de Prisma.
#                Ej: DB_PATH=/var/lib/maderera-sjt/prod.db scripts/backup-db.sh
#   BACKUP_DIR   Directorio de destino (fallback: backups/).
#   RETENTION    Días de retención (fallback: 14). Los backups más viejos
#                se eliminan.
#
# Los backups se generan con `sqlite3 ".backup"`, que produce una copia
# consistente AUN si hay una escritura en curso (no copia el archivo crudo).
#
# CRON (deploy/cron/madererasjt-backup):
#   0 3 * * * DB_PATH=/var/lib/maderera-sjt/prod.db /path/al/repo/scripts/backup-db.sh >> /var/log/maderera-sjt/backup.log 2>&1
#
# NOTAS
#   - backups/ debe estar excluido de git (.gitignore) y, en producción, fuera
#     del árbol servido públicamente.
#   - Uso local:  scripts/backup-db.sh            (backup de prisma/dev.db)
#   - Dry-run:    scripts/backup-db.sh --dry-run  (solo muestra qué haría)

set -euo pipefail

DB_PATH="${DB_PATH:-prisma/dev.db}"
BACKUP_DIR="${BACKUP_DIR:-backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
DRY_RUN=0

if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=1
fi

# 1. Precondiciones
if ! command -v sqlite3 >/dev/null 2>&1; then
  echo "ERROR: sqlite3 no está instalado. Instálalo (apt install sqlite3 / brew install sqlite3)." >&2
  exit 1
fi

if [[ ! -f "$DB_PATH" ]]; then
  echo "ERROR: DB_PATH no existe: $DB_PATH" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"

TS="$(date +%Y%m%d-%H%M%S)"
OUT="${BACKUP_DIR}/prod-${TS}.db"

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "[dry-run] sqlite3 \"$DB_PATH\" \".backup '$OUT'\""
  echo "[dry-run] borraría backups con más de ${RETENTION_DAYS} días en $BACKUP_DIR/"
  echo "[dry-run] sin cambios realizados."
  exit 0
fi

# 2. Backup consistente vía SQLite (no copia cruda del archivo)
if ! sqlite3 "$DB_PATH" ".backup '$OUT'"; then
  echo "ERROR: falló el backup de $DB_PATH hacia $OUT" >&2
  exit 1
fi

echo "Backup OK: $OUT"

# 3. Retención: borrar backups más viejos que RETENTION_DAYS
if command -v find >/dev/null 2>&1; then
  DELETED="$(find "$BACKUP_DIR" -name 'prod-*.db' -type f -mtime "+${RETENTION_DAYS}" -delete -print)"
  if [[ -n "$DELETED" ]]; then
    echo "Backups antiguos eliminados (retención ${RETENTION_DAYS} días):"
    echo "$DELETED"
  else
    echo "Sin backups antiguos que eliminar (retención ${RETENTION_DAYS} días)."
  fi
else
  echo "AVISO: 'find' no está disponible; no se aplicó retención." >&2
fi

exit 0