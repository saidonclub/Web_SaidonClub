import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
user_data_dir = r"C:\Users\Gatita\AppData\Local\Google\Chrome\User Data"
profile_dir = "Profile 34"

cmd = [
    chrome_path,
    "--remote-debugging-port=9222",
    f"--user-data-dir={user_data_dir}",
    f"--profile-directory={profile_dir}",
    "--restore-last-session"
]

print(f"Launching: {' '.join(cmd)}")
# Use Popen to launch in background
subprocess.Popen(cmd, creationflags=subprocess.CREATE_NEW_CONSOLE)
