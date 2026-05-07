import ctypes
import time

def mouse_scroll(clicks):
    # clicks > 0 is up, < 0 is down
    # 120 units per click
    ctypes.windll.user32.mouse_event(0x0800, 0, 0, clicks * 120, 0)

# Move mouse to the center of the Chrome window first
ctypes.windll.user32.SetCursorPos(680, 384)
time.sleep(0.5)

# Scroll down multiple times
for _ in range(5):
    mouse_scroll(-5)
    time.sleep(0.2)
