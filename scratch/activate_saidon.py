import psutil
import subprocess
import time
import os

def kill_chrome():
    print("Iniciando limpieza quirúrgica de Chrome...")
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            if proc.info['name'] == 'chrome.exe':
                print(f"Eliminando proceso {proc.info['pid']}...")
                proc.kill()
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    time.sleep(2)

def launch_saidon():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    user_data = r"C:\Users\Gatita\AppData\Local\Google\Chrome\User Data"
    profile = "Profile 34"
    
    cmd = [
        chrome_path,
        f"--remote-debugging-port=9222",
        f"--user-data-dir={user_data}",
        f"--profile-directory={profile}",
        "--no-first-run",
        "--no-default-browser-check",
        "--restore-last-session"
    ]
    
    print(f"Lanzando sesión SaidOn (Perfil 34) en puerto 9222...")
    subprocess.Popen(cmd)
    time.sleep(5)

def verify():
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('127.0.0.1', 9222))
    if result == 0:
        print("[OK] SISTEMA ACTIVADO: Puerto 9222 escuchando.")
        return True
    else:
        print("[ERROR] El sistema no pudo activar el puerto 9222.")
        return False

if __name__ == "__main__":
    kill_chrome()
    launch_saidon()
    verify()
