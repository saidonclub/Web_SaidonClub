import re

env_file = r"C:\Users\Gatita\OneDrive\Desktop\Web_SaidonClub\.vercel\.env.production.local"

with open(env_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's clean each line
lines = content.splitlines()
new_lines = []
for line in lines:
    if not line or line.startswith('#') or '=' not in line:
        new_lines.append(line)
        continue
    
    key, val = line.split('=', 1)
    val = val.strip()
    
    # 1. Remove literal backslash-r-backslash-n
    val = val.replace(r'\r\n', '')
    
    # 2. Strip all nested double quotes recursively
    while val.startswith('"') and val.endswith('"') and len(val) >= 2:
        val = val[1:-1]
        
    # 3. Re-wrap nicely in a single pair of double quotes
    val = f'"{val}"'
    new_lines.append(f"{key}={val}")

with open(env_file, 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines) + '\n')

print("Env file cleaned perfectly using nested-quote and replace logic!")
