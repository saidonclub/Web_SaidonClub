from PIL import Image

img = Image.open(r"c:\Users\Gatita\OneDrive\Desktop\Web_SaidonClub\docs\system_screenshot.png")
width, height = img.size

# Scan for Chrome's distinct colors (green and yellow close to each other)
candidates = []
for x in range(400, 1100, 10): # step by 10 to speed up
    for y in range(height - 40, height, 5):
        r, g, b = img.getpixel((x, y))[:3]
        # Yellowish
        if r > 200 and g > 200 and b < 100:
            candidates.append((x, y, 'yellow'))
        # Greenish
        if r < 100 and g > 150 and b < 100:
            candidates.append((x, y, 'green'))
        # Reddish
        if r > 200 and g < 100 and b < 100:
            candidates.append((x, y, 'red'))

print("Candidates found:")
clusters = {}
for cx, cy, ctype in candidates:
    # cluster by x-coordinate (divide by 40)
    bx = cx // 40
    if bx not in clusters:
        clusters[bx] = set()
    clusters[bx].add(ctype)

for bx, types in sorted(clusters.items()):
    if len(types) >= 2:  # Found an icon with at least 2 of the colors
        print(f"Possible Chrome icon at x = {bx * 40 + 20}, y = 748, colors: {types}")
