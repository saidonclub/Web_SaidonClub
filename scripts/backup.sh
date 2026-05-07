#!/bin/bash
# SaidonClub Backup Script
# Automatiza el backup de datos, archivos y base de datos

set -e

# Configuración
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${PROJECT_DIR}/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="saidonclub_backup_${TIMESTAMP}"
LOG_FILE="${BACKUP_DIR}/backup.log"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
  echo -e "${GREEN}[$(date +%Y-%m-%d\ %H:%M:%S)]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
  echo -e "${RED}[$(date +%Y-%m-%d\ %H:%M:%S)] ERROR:${NC} $1" | tee -a "$LOG_FILE"
}

warn() {
  echo -e "${YELLOW}[$(date +%Y-%m-%d\ %H:%M:%S)] WARN:${NC} $1" | tee -a "$LOG_FILE"
}

# Crear directorio de backups
mkdir -p "$BACKUP_DIR"

log "=== Starting SaidonClub Backup ==="
log "Backup name: $BACKUP_NAME"

# Función para cleanup de backups antiguos
cleanup_old_backups() {
  local days=${1:-7}
  log "Cleaning up backups older than $days days..."
  
  find "$BACKUP_DIR" -name "saidonclub_backup_*" -type d -mtime +$days -exec rm -rf {} \; 2>/dev/null || true
  find "$BACKUP_DIR" -name "*.tar.gz" -type f -mtime +$days -delete 2>/dev/null || true
  
  log "Cleanup complete"
}

# Backup de código fuente
backup_source() {
  log "Backing up source code..."
  
  local src_dir="${BACKUP_DIR}/${BACKUP_NAME}/source"
  mkdir -p "$src_dir"
  
  # Exclude node_modules, .git, etc
  rsync -av --progress \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '*.log' \
    --exclude '.env.local' \
    --exclude 'dist' \
    --exclude '.next' \
    --exclude 'coverage' \
    "$PROJECT_DIR/" "$src_dir/" 2>/dev/null || cp -r "$PROJECT_DIR" "$src_dir"
  
  log "Source code backed up"
}

# Backup de configuración
backup_config() {
  log "Backing up configuration..."
  
  local config_dir="${BACKUP_DIR}/${BACKUP_NAME}/config"
  mkdir -p "$config_dir"
  
  # Essential config files
  local config_files=(
    "package.json"
    "turbo.json"
    ".env.example"
    "tsconfig.json"
    "vitest.config.ts"
  )
  
  for file in "${config_files[@]}"; do
    if [ -f "$PROJECT_DIR/$file" ]; then
      cp "$PROJECT_DIR/$file" "$config_dir/" 2>/dev/null || true
    fi
  done
  
  log "Configuration backed up"
}

# Backup de base de datos (si existe)
backup_database() {
  log "Checking for database backup..."
  
  # Detectar tipo de base de datos y hacer backup
  if [ -f "$PROJECT_DIR/prisma/schema.prisma" ]; then
    warn "Prisma schema found - use prisma migrate export for DB backup"
  fi
  
  # PostgreSQL backup example (comentado por seguridad)
  # if [ "$DB_URL" ]; then
  #   pg_dump "$DB_URL" > "${BACKUP_DIR}/${BACKUP_NAME}/database.sql"
  # fi
  
  log "Database backup check complete"
}

# Backup de uploads/media
backup_uploads() {
  log "Backing up uploads directory..."
  
  if [ -d "$PROJECT_DIR/apps/web/public/uploads" ]; then
    local uploads_dir="${BACKUP_DIR}/${BACKUP_NAME}/uploads"
    mkdir -p "$uploads_dir"
    cp -r "$PROJECT_DIR/apps/web/public/uploads" "$uploads_dir/" 2>/dev/null || true
    log "Uploads backed up"
  else
    warn "No uploads directory found"
  fi
}

# Comprimir backup
compress_backup() {
  log "Compressing backup..."
  
  cd "$BACKUP_DIR"
  tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME"
  rm -rf "$BACKUP_NAME"
  
  log "Backup compressed: ${BACKUP_NAME}.tar.gz"
}

# Verificar integridad
verify_backup() {
  log "Verifying backup integrity..."
  
  local archive="${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
  
  if tar -tzf "$archive" > /dev/null 2>&1; then
    local size=$(du -h "$archive" | cut -f1)
    log "Backup verified - Size: $size"
  else
    error "Backup verification failed!"
    return 1
  fi
}

# Mostrar resumen
show_summary() {
  log "=== Backup Summary ==="
  log "Backup file: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
  log "Size: $(du -h "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" | cut -f1)"
  log "Date: $(date +%Y-%m-%d\ %H:%M:%S)"
  
  # Listar backups disponibles
  log "Available backups:"
  ls -lh "$BACKUP_DIR"/*.tar.gz 2>/dev/null | tail -5
}

# Main execution
main() {
  local keep_days=${1:-7}
  
  # Verificar dependencies
  command -v tar >/dev/null 2>&1 || { error "tar is required but not installed."; exit 1; }
  
  # Ejecutar backup
  backup_source
  backup_config
  backup_database
  backup_uploads
  compress_backup
  verify_backup
  cleanup_old_backups $keep_days
  show_summary
  
  log "=== Backup Complete ==="
}

# Ejecutar con argumento opcional: días a mantener backups
main "$@"