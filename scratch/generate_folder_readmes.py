import os

def create_readme(path, title, description):
    readme_path = os.path.join(path, "README.md")
    if not os.path.exists(readme_path):
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(f"# 📂 {title}\n\n{description}\n")
        print(f"Created: {readme_path}")
    else:
        print(f"Skipped (exists): {readme_path}")

def main():
    base_dir = r"c:\Users\Gatita\OneDrive\Desktop\Web_SaidonClub"
    
    # 1. Packages
    packages_dir = os.path.join(base_dir, "packages")
    if os.path.exists(packages_dir):
        for pkg in os.listdir(packages_dir):
            pkg_path = os.path.join(packages_dir, pkg)
            if os.path.isdir(pkg_path):
                create_readme(pkg_path, pkg.replace("-", " ").title(), f"Lógica compartida para el módulo {pkg}.")

    # 2. Components
    components_dir = os.path.join(base_dir, "apps", "web", "components")
    if os.path.exists(components_dir):
        for comp in os.listdir(components_dir):
            comp_path = os.path.join(components_dir, comp)
            if os.path.isdir(comp_path):
                create_readme(comp_path, comp.replace("-", " ").title(), f"Componentes de UI relacionados con {comp}.")

    # 3. Lib/Utils
    lib_dir = os.path.join(base_dir, "apps", "web", "lib")
    if os.path.exists(lib_dir):
        create_readme(lib_dir, "Lib", "Librerías internas, servicios y utilidades del servidor.")
        
    utils_dir = os.path.join(base_dir, "apps", "web", "utils")
    if os.path.exists(utils_dir):
        create_readme(utils_dir, "Utils", "Funciones de utilidad puras y helpers de cliente.")

if __name__ == "__main__":
    main()
