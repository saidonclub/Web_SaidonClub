import psutil
for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
    if proc.info['name'] == 'chrome.exe':
        print(f"PID: {proc.info['pid']}")
        print(f"CMD: {' '.join(proc.info['cmdline']) if proc.info['cmdline'] else 'N/A'}")
        print("-" * 40)
