import ctypes
import time
from PIL import Image

def get_mouse_pos():
    class POINT(ctypes.Structure):
        _fields_ = [("x", ctypes.c_long), ("y", ctypes.c_long)]
    pt = POINT()
    ctypes.windll.user32.GetCursorPos(ctypes.byref(pt))
    return pt.x, pt.y

def set_mouse_pos(x, y):
    ctypes.windll.user32.SetCursorPos(x, y)

def mouse_click(x, y):
    set_mouse_pos(x, y)
    ctypes.windll.user32.mouse_event(2, 0, 0, 0, 0) # left down
    time.sleep(0.1)
    ctypes.windll.user32.mouse_event(4, 0, 0, 0, 0) # left up

img = Image.open(r"c:\Users\Gatita\OneDrive\Desktop\Web_SaidonClub\docs\system_screenshot.png")
width, height = img.size

# The pink badge has a strong red/blue component and low green.
pink_pixels = []
for y in range(height - 40, height):
    for x in range(400, width - 100):  # avoid sys tray
        r, g, b = img.getpixel((x, y))[:3]
        if r > 200 and g < 150 and b > 150:
            pink_pixels.append((x, y))

if pink_pixels:
    avg_x = sum(p[0] for p in pink_pixels) // len(pink_pixels)
    avg_y = sum(p[1] for p in pink_pixels) // len(pink_pixels)
    print(f"Found pink badge at {avg_x}, {avg_y}. Clicking...")
    # Click slightly to the left/up of the badge to hit the center of the Chrome icon
    target_x = avg_x - 10
    target_y = avg_y - 10
    mouse_click(target_x, target_y)
else:
    print("Could not find the pink badge!")
