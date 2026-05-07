# Automatización de Backups

## Configuración de Cron Job

### Para ejecutar backups automáticos, agregar al crontab:

```bash
# Editar crontab
crontab -e

# Backup diario a las 2:00 AM
0 2 * * * cd /path/to/Web_SaidonClub && pnpm exec tsx scripts/backup.sh

# Backup semanal los domingos a las 3:00 AM
0 3 * * 0 cd /path/to/Web_SaidonClub && pnpm exec tsx scripts/backup.sh --full
```

### Alternativa: Usar script directamente

```bash
# Hacer ejecutable el script
chmod +x scripts/backup.sh

# Agregar al crontab (Linux/Mac)
echo "0 2 * * * /path/to/Web_SaidonClub/scripts/backup.sh" >> /var/spool/cron/crontabs/root

# En Windows usar Task Scheduler
# Crear tarea que ejecute: pnpm exec tsx scripts/backup.sh
```

## Opciones del Script

- `--full` - Backup completo incluyendo todas las tablas
- `--incremental` - Solo cambios desde último backup
- `--compress` - Comprimir backup con gzip
- `--restore` - Restaurar desde backup

## Políticas de Retención

- Backups diarios: mantener 7 días
- Backups semanales: mantener 4 semanas
- Backups mensuales: mantener 12 meses

El script automáticamente limpia backups antiguos según esta política.