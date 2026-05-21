import os
import zipfile
from datetime import datetime

def make_backup():
    source_dir = r"c:\Users\Gatita\OneDrive\Desktop\Web_SaidonClub"
    backup_dir = os.path.join(source_dir, "backups")
    
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
        print(f"Creado directorio de backups: {backup_dir}")
        
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    zip_filename = f"saidonclub_backup_{timestamp}.zip"
    zip_filepath = os.path.join(backup_dir, zip_filename)
    
    # Directorios y archivos a excluir de forma robusta
    exclude_dirs = {
        ".git",
        ".next",
        ".vercel",
        "node_modules",
        "agency_venv",
        ".turbo",
        "temp_chrome",
        "videos",
        "screenshots",
        "test-results",
        "backups",
        "backup_20260430_1416",
        "backup_before_restoration_ed9c",
        "backup_saidon_os_snapshot",
        "backup_source_snapshot",
        "out",
        "dist"
    }
    
    exclude_files = {
        "stress.log",
        "stress_tail.log"
    }
    
    print(f"Iniciando respaldo de {source_dir}...")
    print(f"Archivo de destino: {zip_filepath}")
    print(f"Excluyendo directorios: {', '.join(exclude_dirs)}")
    
    count_files = 0
    count_dirs = 0
    
    with zipfile.ZipFile(zip_filepath, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # Filtrar directorios en la búsqueda recursiva
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            # Comprobar si el root actual contiene partes a excluir en su ruta completa
            relative_root = os.path.relpath(root, source_dir)
            path_parts = relative_root.split(os.sep)
            if any(part in exclude_dirs for part in path_parts):
                continue
                
            for file in files:
                if file in exclude_files or file.endswith('.zip') or file.endswith('.heapsnapshot'):
                    continue
                file_path = os.path.join(root, file)
                archive_name = os.path.relpath(file_path, source_dir)
                zipf.write(file_path, archive_name)
                count_files += 1
            
            count_dirs += 1
            
    size_mb = os.path.getsize(zip_filepath) / (1024 * 1024)
    print("\n¡Respaldo COMPLETADO con éxito!")
    print(f"Archivo comprimido: {zip_filename}")
    print(f"Tamaño: {size_mb:.2f} MB")
    print(f"Total de archivos archivados: {count_files}")
    print(f"Total de carpetas procesadas: {count_dirs}")
    return zip_filepath

if __name__ == "__main__":
    make_backup()
