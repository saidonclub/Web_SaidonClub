"""
setup_debug_profile.py
=======================
Configura el directorio ChromeDebug para que Chrome:
1. Arranque DIRECTAMENTE en el perfil Default (sin selector)
2. Tenga el remote debugging port activo en 9222
3. NO muestre banners ni pida cuenta Google
"""
import os, json, shutil, time, subprocess, urllib.request, urllib.error, sys

CHROME_EXE   = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
ORIGINAL_DIR = r"C:\Users\Gatita\AppData\Local\Google\Chrome\User Data"
PROFILE_SRC  = os.path.join(ORIGINAL_DIR, "Profile 34")
DEBUG_DIR    = r"C:\Users\Gatita\AppData\Local\Google\ChromeDebug"
PROFILE_DEST = os.path.join(DEBUG_DIR, "Default")
DEBUG_PORT   = 9222


def kill_chrome():
    subprocess.run(["taskkill","/F","/IM","chrome.exe","/T"], capture_output=True)
    for _ in range(6):
        time.sleep(1)
        r = subprocess.run(["tasklist","/FI","IMAGENAME eq chrome.exe","/NH"], capture_output=True, text=True)
        if "chrome.exe" not in r.stdout:
            print("[1] Chrome detenido.")
            return
    print("[1] ADVERTENCIA: Chrome aun activo.")


def configure_local_state():
    """
    Crea/modifica Local State para:
    - Deshabilitar el selector de perfiles al inicio
    - Marcar Default como perfil activo
    - Suprimir la burbuja de primer uso
    """
    local_state_path = os.path.join(DEBUG_DIR, "Local State")

    # Copiar Local State original como base (tiene info de cuentas)
    original_ls = os.path.join(ORIGINAL_DIR, "Local State")
    if os.path.exists(original_ls):
        shutil.copy2(original_ls, local_state_path)

    # Leer y modificar
    state = {}
    if os.path.exists(local_state_path):
        try:
            with open(local_state_path, "r", encoding="utf-8") as f:
                state = json.load(f)
        except Exception:
            state = {}

    # Desactivar selector de perfil al arranque
    if "profile" not in state:
        state["profile"] = {}

    state["profile"]["last_used"] = "Default"
    state["profile"]["last_active_profiles"] = ["Default"]

    # Suprimir diálogos de primer uso y selector
    if "browser" not in state:
        state["browser"] = {}
    state["browser"]["has_seen_welcome_page"] = True
    state["browser"]["show_profile_picker_on_startup"] = 0  # 0 = never

    # Marcar que no es primer uso
    if "first_run_info" not in state:
        state["first_run_info"] = {}
    state["first_run_info"]["first_run_ui_attempted"] = True

    with open(local_state_path, "w", encoding="utf-8") as f:
        json.dump(state, f)
    print("[2] Local State configurado: selector desactivado, perfil Default activo.")


def sync_profile():
    """Copia el Perfil 34 como Default en el debug dir"""
    os.makedirs(DEBUG_DIR, exist_ok=True)
    os.makedirs(PROFILE_DEST, exist_ok=True)

    # Archivos esenciales del perfil
    FILES = ["Preferences","Bookmarks","Cookies","Login Data","Web Data",
             "History","Favicons","Trusted Vault Encryption Keys","Secure Preferences"]
    DIRS  = ["Extensions","Local Extension Settings","Local Storage",
             "Session Storage","IndexedDB","Extension State","Sync Data",
             "Databases","File System","Service Worker"]

    copied = 0
    for name in FILES:
        src = os.path.join(PROFILE_SRC, name)
        dst = os.path.join(PROFILE_DEST, name)
        if os.path.isfile(src):
            try: shutil.copy2(src, dst); copied += 1
            except: pass

    for name in DIRS:
        src = os.path.join(PROFILE_SRC, name)
        dst = os.path.join(PROFILE_DEST, name)
        if os.path.isdir(src):
            try:
                if os.path.exists(dst): shutil.rmtree(dst)
                shutil.copytree(src, dst, ignore_errors=True); copied += 1
            except: pass

    # Parchear Preferences del perfil destino
    prefs_path = os.path.join(PROFILE_DEST, "Preferences")
    if os.path.exists(prefs_path):
        try:
            with open(prefs_path, "r", encoding="utf-8") as f:
                prefs = json.load(f)
            if "profile" not in prefs: prefs["profile"] = {}
            prefs["profile"]["exit_type"] = "Normal"
            prefs["profile"]["exited_cleanly"] = True
            # Desactivar cualquier restauración de sesión
            if "session" not in prefs: prefs["session"] = {}
            prefs["session"]["restore_on_startup"] = 5  # 5 = nueva pestaña
            with open(prefs_path, "w", encoding="utf-8") as f:
                json.dump(prefs, f)
        except Exception as e:
            print("  AVISO prefs:", e)

    print("[3] Perfil 34 sincronizado como Default ({} items).".format(copied))


def launch_chrome():
    """
    Lanza Chrome con:
    - --profile-directory=Default  -> entra directo al perfil sin selector
    - --remote-debugging-port=9222 -> debug activo
    """
    flags = [
        CHROME_EXE,
        "--remote-debugging-port={}".format(DEBUG_PORT),
        "--user-data-dir={}".format(DEBUG_DIR),
        "--profile-directory=Default",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-infobars",
        "--password-store=basic",
        "--use-mock-keychain",
        "--disable-blink-features=AutomationControlled",
        "--excludeSwitches=enable-automation",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-breakpad",
        "--disable-client-side-phishing-detection",
        "--disable-component-update",
        "--disable-default-apps",
        "--disable-dev-shm-usage",
        "--disable-hang-monitor",
        "--disable-ipc-flooding-protection",
        "--disable-popup-blocking",
        "--disable-prompt-on-repost",
        "--disable-renderer-backgrounding",
        "--disable-sync",
        "--metrics-recording-only",
        "--no-first-run",
        "--safebrowsing-disable-auto-update",
        "--password-store=basic",
        "--use-mock-keychain",
        "--suppress-message-center-popups",
    ]
    proc = subprocess.Popen(flags,
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, stdin=subprocess.DEVNULL)
    print("[4] Chrome lanzado PID:", proc.pid)
    return proc


def verify_and_list(retries=20, delay=1.5):
    url_version = "http://127.0.0.1:{}/json/version".format(DEBUG_PORT)
    url_pages   = "http://127.0.0.1:{}/json".format(DEBUG_PORT)
    for i in range(retries):
        try:
            with urllib.request.urlopen(url_version, timeout=3) as r:
                data = json.loads(r.read().decode())
            with urllib.request.urlopen(url_pages, timeout=3) as r:
                pages = json.loads(r.read().decode())
            print("")
            print("[5] CONEXION EXITOSA - Browser:", data.get("Browser","?"))
            print("    WS:", data.get("webSocketDebuggerUrl","N/A"))
            print("")
            print("    Paginas ({} total):".format(len(pages)))
            for p in pages:
                print("      [{}] {} | {}".format(
                    p.get("type","?"),
                    p.get("title","?")[:45],
                    p.get("url","?")[:55]
                ))
            return True
        except Exception:
            print("  [{}/{}] Esperando...".format(i+1, retries))
            time.sleep(delay)
    print("[5] FALLO: sin conexion en", retries, "intentos.")
    return False


def main():
    print("="*60)
    print("  SETUP CHROME DEBUG PROFILE v4.1")
    print("="*60)
    kill_chrome()
    sync_profile()
    configure_local_state()
    launch_chrome()
    time.sleep(4)
    ok = verify_and_list()
    print("\n" + "="*60)
    if ok:
        print("  LISTO. MCP puede conectar en http://127.0.0.1:{}".format(DEBUG_PORT))
    else:
        print("  FALLO. Revisa el log.")
    print("="*60)
    return 0 if ok else 1

if __name__ == "__main__":
    sys.exit(main())
