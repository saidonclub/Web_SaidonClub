import os
import re

# Ruta del proyecto
PROJECT_ROOT = r"c:\Users\Gatita\OneDrive\Desktop\Web_SaidonClub"

def read_file_safe(path):
    """Intenta leer un archivo con múltiples encodificaciones para evitar errores."""
    if not os.path.exists(path):
        # Intentar buscar en subdirectorios
        print(f"⚠️ Archivo no encontrado en ruta directa: {path}")
        return None
    
    encodings = ['utf-8', 'utf-16', 'utf-16-le', 'utf-16-be', 'latin-1', 'cp1252']
    for encoding in encodings:
        try:
            with open(path, 'r', encoding=encoding) as f:
                content = f.read()
                print(f"📖 Leído con éxito ({encoding}): {os.path.basename(path)}")
                return content
        except Exception:
            continue
    print(f"❌ Error crítico: No se pudo leer {path} con ninguna codificación.")
    return None

def unify_text_data():
    """Unifica todos los archivos de texto (.txt) con credenciales y el Documento Maestro original."""
    print("\n--- Fase 2: Unificando Archivos de Datos y Credenciales (.txt) ---")
    
    txt_files = [
        os.path.join(PROJECT_ROOT, "API-Key Open Router.txt"),
        os.path.join(PROJECT_ROOT, "Datos_relevantes_SaidonClub.txt"),
        os.path.join(PROJECT_ROOT, "Datos relevantes, Credenciales y APIs de SaidonClub (5).txt"),
        os.path.join(PROJECT_ROOT, "docs", "credentials", "Datos relevantes, Credenciales y APIs de SaidonClub.txt"),
        os.path.join(PROJECT_ROOT, "Documento Maestro definitivo de SAIDONCLUB.txt")
    ]
    
    unified_content = []
    unified_content.append("================================================================================\n")
    unified_content.append("         SAIDONCLUB — DOCUMENTO MAESTRO Y BASE DE DATOS RELEVANTES COMPLETA     \n")
    unified_content.append("================================================================================\n\n")
    unified_content.append("Este archivo consolida de forma segura e íntegra todas las credenciales, APIs,\n")
    unified_content.append("contactos y el Documento Maestro de identidad y modelo económico de SaidonClub.\n\n")
    unified_content.append(f"Generado el: {os.popen('date /t').read().strip()} {os.popen('time /t').read().strip()}\n")
    unified_content.append("================================================================================\n\n")
    
    for file_path in txt_files:
        content = read_file_safe(file_path)
        if content:
            filename = os.path.basename(file_path)
            unified_content.append(f"\n\n--- INICIO DE ARCHIVO: {filename} ---")
            unified_content.append(f"\nRuta original: {os.path.relpath(file_path, PROJECT_ROOT)}\n")
            unified_content.append("-" * 60 + "\n")
            unified_content.append(content)
            unified_content.append(f"\n--- FIN DE ARCHIVO: {filename} ---\n")
            
    output_path = os.path.join(PROJECT_ROOT, "DOCUMENTO_MAESTRO_Y_DATOS_RELEVANTES.txt")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("".join(unified_content))
    print(f"✅ ¡Éxito! Archivo maestro de credenciales y especificaciones creado en: {output_path}")
    return txt_files

def unify_roadmaps():
    """Unifica todas las hojas de ruta, progresos y checklists en uno solo muy detallado."""
    print("\n--- Fase 3: Unificando Hojas de Ruta y Checklists (.md) ---")
    
    roadmap_files = [
        os.path.join(PROJECT_ROOT, "ROADMAP.md"),
        os.path.join(PROJECT_ROOT, "CHECKLIST.md"),
        os.path.join(PROJECT_ROOT, "DEPLOY_CHECKLIST.md"),
        os.path.join(PROJECT_ROOT, "task_progress.md"),
        os.path.join(PROJECT_ROOT, "docs", "AGENT_CHECKLIST.md")
    ]
    
    unified_content = []
    unified_content.append("# 🗺️ SAIDONCLUB — HOJA DE RUTA Y PLANIFICACIÓN CONSOLIDADA (ROADMAP MAESTRO)\n\n")
    unified_content.append("> **Nota de Integridad:** Este documento unifica de forma exhaustiva todos los planes de acción, ")
    unified_content.append("listas de verificación de despliegue, hojas de ruta de agentes e historiales de progreso ")
    unified_content.append("de SaidonClub en una única fuente de verdad actualizada.\n\n")
    unified_content.append("---\n\n")
    
    for file_path in roadmap_files:
        content = read_file_safe(file_path)
        if content:
            filename = os.path.basename(file_path)
            # Remove title if it duplicates
            clean_content = re.sub(r'^#\s+.*', '', content).strip()
            unified_content.append(f"## 📁 {filename} (Consolidado)\n")
            unified_content.append(f"*Ruta de origen: `{os.path.relpath(file_path, PROJECT_ROOT)}`*\n\n")
            unified_content.append(clean_content)
            unified_content.append("\n\n---\n\n")
            
    output_path = os.path.join(PROJECT_ROOT, "SAIDONCLUB_ROADMAP_OFICIAL.md")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("".join(unified_content))
    print(f"✅ ¡Éxito! Hoja de ruta y checklist unificado creado en: {output_path}")
    return roadmap_files

def unify_documentation():
    """Unifica toda la documentación técnica, arquitectónica y auditorías forenses en un libro maestro."""
    print("\n--- Fase 4: Unificando Documentación Técnica y Auditorías (.md) ---")
    
    # Lista estructurada de archivos por capítulos
    chapters = {
        "1. MANUAL DEL DESARROLLADOR E INTRODUCCIÓN": [
            "README.md",
            "CONTRIBUTING.md",
            "ENV.md",
            "STYLE_GUIDE.md"
        ],
        "2. PLANES DE EJECUCIÓN Y VISIÓN ESTRUCTURAL": [
            "PLAN_MAESTRO.md",
            "PLAN_EJECUCION_SAIDONCLUB_ANTIGRAVITY.md",
            "CASOS_DE_USO.md"
        ],
        "3. ARQUITECTURA DE INGENIERÍA, BASE DE DATOS Y MOTOR MLM": [
            "ARCHITECTURE.md",
            "docs/PRD_MLM_SYSTEM.md",
            "credentials.md" # Contiene esquemas prisma y logs de seguridad
        ],
        "4. AUDITORÍAS TÉCNICAS, DE SEGURIDAD Y FORENSES": [
            "AUDITORIA_COMPLETA_SISTEMA.md",
            "AUDITORIA_FORENSE_2026-05-12.md",
            "REPORTE_AUDITORIA_FORENSE_v7.md",
            "docs/AUDIT_V6_COMPLETO.md",
            "docs/AUDIT_SUMMARY.md",
            "docs/reports/COMPLETE_SYSTEM_AUDIT_2026-05-01.md",
            "docs/reports/SWARM_AUDIT_REPORT.md",
            "docs/reports/AUDITORIA_FORENSE_CHECKLIST.md",
            "docs/reports/AUDITORIA_COMPLETA_E2E.md",
            "docs/reports/AUTOANALISIS_KIMI_CODE_NVIDIA.md",
            "docs/reports/database_auth_audit_2026-04-23.md",
            "docs/reports/SYSTEM_AUDIT.md"
        ],
        "5. AUDITORÍAS DE DISEÑO, SEO Y MARKETING": [
            "SEO_AUDIT.md",
            "COPY_AUDIT.md",
            "docs/reports/UI_PREMIUM_AUDIT_2026_04_25.md",
            "docs/reports/BROWSER_TEST_2026-04-28.md"
        ],
        "6. ANÁLISIS DE NUBE Y DESPLIEGUE EN PRODUCCIÓN": [
            "REPORTE_DESPLIEGUE_NUBE.md",
            "ANALISIS_COMPARATIVO_SAIDONCLUB.md",
            "REPORTE_AUDITORIA_FINAL_PRODUCCION.md",
            "docs/BACKUP_AUTOMATION.md"
        ]
    }
    
    unified_content = []
    unified_content.append("# 📚 SAIDONCLUB — DOCUMENTACIÓN MAESTRA Y LIBRO DE INGENIERÍA COMPLETO\n\n")
    unified_content.append("> **DOCUMENTO DE VERDAD ABSOLUTA DE SAIDONCLUB**\n")
    unified_content.append("> Este compendio técnico unifica absolutamente toda la arquitectura, manuales de desarrollo, ")
    unified_content.append("especificaciones del motor MLM, base de datos Prisma y PostgreSQL, y el historial de auditorías forenses ")
    unified_content.append("y despliegues en la nube de SaidonClub. Refleja fielmente la realidad técnica local y remota.\n\n")
    unified_content.append("---\n\n")
    
    # Generar Tabla de Contenidos automatizada
    unified_content.append("## 📌 ÍNDICE GENERAL DEL SISTEMA\n\n")
    for chapter_name, files in chapters.items():
        unified_content.append(f"### {chapter_name}\n")
        for file in files:
            full_path = os.path.join(PROJECT_ROOT, file.replace("/", os.sep))
            if os.path.exists(full_path):
                basename = os.path.basename(file)
                # Crear slug para el link
                slug = basename.lower().replace('.', '').replace('_', '-').replace('/', '-')
                unified_content.append(f"- [{basename}](#-{slug}-origen)\n")
        unified_content.append("\n")
        
    unified_content.append("\n---\n\n")
    
    all_read_paths = []
    
    # Leer y concatenar el contenido estructurado en capítulos
    for chapter_name, files in chapters.items():
        unified_content.append(f"# 📘 SECCIÓN: {chapter_name}\n\n")
        unified_content.append("=" * 80 + "\n\n")
        
        for file in files:
            full_path = os.path.join(PROJECT_ROOT, file.replace("/", os.sep))
            content = read_file_safe(full_path)
            if content:
                basename = os.path.basename(file)
                slug = basename.lower().replace('.', '').replace('_', '-').replace('/', '-')
                unified_content.append(f"## 📄 {basename} (Origen)\n")
                unified_content.append(f"*Ruta original del archivo en el sistema: `{file}`*\n\n")
                
                # Quitar títulos duplicados del archivo si existen
                clean_content = re.sub(r'^#\s+.*', '', content).strip()
                unified_content.append(clean_content)
                unified_content.append("\n\n---\n\n")
                all_read_paths.append(full_path)
                
    output_path = os.path.join(PROJECT_ROOT, "SAIDONCLUB_DOCUMENTACION_MAESTRA.md")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("".join(unified_content))
    print(f"✅ ¡Éxito! Documentación maestra consolidada creada en: {output_path}")
    return all_read_paths

def purge_trash_and_redundancy(unified_txt, unified_roadmaps, unified_docs):
    """Purga de forma extremadamente segura todos los archivos unificados y de registro inútiles."""
    print("\n--- Fase 5: Depuración y Limpieza Profunda de Basura y Redundancia ---")
    
    # 1. Archivos unificados
    files_to_delete = []
    files_to_delete.extend(unified_txt)
    files_to_delete.extend(unified_roadmaps)
    files_to_delete.extend(unified_docs)
    
    # 2. Logs e intermedios de compilación/linting inútiles
    trash_logs = [
        os.path.join(PROJECT_ROOT, "stress.log"),
        os.path.join(PROJECT_ROOT, "stress_tail.log"),
        os.path.join(PROJECT_ROOT, "lint_output.txt"),
        os.path.join(PROJECT_ROOT, "new_lint_output.txt"),
        os.path.join(PROJECT_ROOT, "web_lint_current.txt"),
        os.path.join(PROJECT_ROOT, "web_lint_current_utf8.txt"),
        os.path.join(PROJECT_ROOT, "web_lint_output.txt"),
        os.path.join(PROJECT_ROOT, "web_lint_output_utf8.txt"),
        os.path.join(PROJECT_ROOT, "build.log"),
        os.path.join(PROJECT_ROOT, "vercel-build.log"),
        os.path.join(PROJECT_ROOT, "vercel-build_full_utf8.txt"),
        os.path.join(PROJECT_ROOT, "vercel-build_utf8.txt"),
        os.path.join(PROJECT_ROOT, "build_utf8.txt"),
        os.path.join(PROJECT_ROOT, "vercel_deploy_log.txt"),
        os.path.join(PROJECT_ROOT, "vercel_deploy_log_full_utf8.txt"),
        os.path.join(PROJECT_ROOT, "vercel_deploy_log_utf8.txt"),
    ]
    files_to_delete.extend(trash_logs)
    
    deleted_count = 0
    errors_count = 0
    
    for file_path in files_to_delete:
        # Excluir los nuevos archivos maestros unificados de cualquier eliminación
        filename = os.path.basename(file_path)
        if filename in ["DOCUMENTO_MAESTRO_Y_DATOS_RELEVANTES.txt", "SAIDONCLUB_ROADMAP_OFICIAL.md", "SAIDONCLUB_DOCUMENTACION_MAESTRA.md", "make_backup.py", "unify_system.py"]:
            continue
            
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"🗑️ Eliminado: {os.path.relpath(file_path, PROJECT_ROOT)}")
                deleted_count += 1
            except Exception as e:
                print(f"⚠️ Error al eliminar {os.path.relpath(file_path, PROJECT_ROOT)}: {e}")
                errors_count += 1
                
    # Limpiar directorios vacíos en docs/reports si están vacíos
    reports_dir = os.path.join(PROJECT_ROOT, "docs", "reports")
    if os.path.exists(reports_dir) and not os.listdir(reports_dir):
        try:
            os.rmdir(reports_dir)
            print(f"🗑️ Eliminado directorio vacío: docs/reports")
        except Exception:
            pass
            
    credentials_dir = os.path.join(PROJECT_ROOT, "docs", "credentials")
    if os.path.exists(credentials_dir) and not os.listdir(credentials_dir):
        try:
            os.rmdir(credentials_dir)
            print(f"🗑️ Eliminado directorio vacío: docs/credentials")
        except Exception:
            pass
            
    print(f"\n🧹 ¡Limpieza completada! Archivos eliminados: {deleted_count}. Errores: {errors_count}")

def run_all():
    print("🚀 INICIANDO PROTOCOLO COMPLETO DE UNIFICACIÓN Y DEPURACIÓN SECTORIAL 🚀")
    print("=" * 80)
    
    # Hacer unificación
    txt_files = unify_text_data()
    roadmap_files = unify_roadmaps()
    doc_files = unify_documentation()
    
    # Purgar redundancia
    purge_trash_and_redundancy(txt_files, roadmap_files, doc_files)
    
    print("\n" + "=" * 80)
    print("🎉 ¡TODO EL SISTEMA SAIDONCLUB HA SIDO PERFECTAMENTE UNIFICADO Y OPTIMIZADO! 🎉")
    print("Los 3 nuevos pilares de verdad del sistema están en la raíz:")
    print("1. DOCUMENTO_MAESTRO_Y_DATOS_RELEVANTES.txt")
    print("2. SAIDONCLUB_ROADMAP_OFICIAL.md")
    print("3. SAIDONCLUB_DOCUMENTACION_MAESTRA.md")
    print("=" * 80)

if __name__ == "__main__":
    run_all()
