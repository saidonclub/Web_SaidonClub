import os
import re

def replace_colors_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Helper function to convert rgba to color-mix
    def replace_rgba(match):
        r, g, b, a_str = match.groups()
        r, g, b = r.strip(), g.strip(), b.strip()
        a = float(a_str.strip())
        
        percent = int(a * 100) if a * 100 == int(a * 100) else a * 100
        
        # Determine base color based on rgb values
        base_color = None
        if r in ('255', '251', '249', '252') and g in ('107', '61', '115', '126', '129') and b in ('0', '22', '74'):
            base_color = 'var(--clr-orange)'
        elif r in ('16', '34', '37', '154', '15') and g in ('185', '197', '211', '230', '118') and b in ('129', '94', '102', '180', '110'):
            base_color = 'var(--clr-success)'
        elif r in ('245', '251', '255') and g in ('158', '191', '171') and b in ('11', '36', '0'):
            base_color = 'var(--clr-warn)'
        elif r in ('59', '14', '37', '6', '99', '96', '0') and g in ('130', '165', '99', '182', '102', '179', '112') and b in ('246', '233', '235', '212', '241', '237', '250', '186'):
            base_color = 'var(--clr-info)'
        elif r in ('168', '139', '147', '192') and g in ('85', '92', '51', '132') and b in ('247', '246', '234', '252'):
            base_color = 'var(--clr-mlm)'
        elif r in ('239', '255', '225') and g in ('68', '107', '29') and b in ('68', '107', '72'):
            base_color = 'var(--clr-error)'
        elif r == '255' and g == '255' and b == '255':
            base_color = 'white'
        elif r in ('0', '5', '10', '15', '17', '20', '25', '23', '40', '60') and g in ('0', '5', '10', '15', '17', '20', '25', '23', '40', '60') and b in ('0', '5', '10', '11', '15', '19', '20', '25', '26', '40', '60'):
            base_color = 'var(--clr-bg-base)'
        elif r in ('156', '160', '244') and g in ('163', '174', '244') and b in ('175', '192', '245'):
            base_color = 'white'
        else:
            # Leave as is if not matched to a specific theme color
            return match.group(0)

        return f"color-mix(in srgb, {base_color} {percent}%, transparent)"

    # Regex to find rgba(r, g, b, a)
    rgba_pattern = re.compile(r'rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)')
    content = rgba_pattern.sub(replace_rgba, content)
    
    # Replace common hex colors
    hex_replacements = {
        '#FF3D00': 'var(--clr-orange)',
        '#ff8f00': 'var(--clr-orange-light)',
        '#ff6b00': 'var(--clr-orange)',
        '#ff8c3a': 'var(--clr-orange-light)',
        '#ff8c33': 'var(--clr-orange)',
        '#ffb800': 'var(--clr-warn)',
        '#f59e0b': 'var(--clr-warn)',
        '#e66000': 'var(--clr-orange)',
        '#FF4D4D': 'var(--clr-error)',
        '#ef4444': 'var(--clr-error)',
        '#FF6B6B': 'var(--clr-error)',
        '#fbbf24': 'var(--clr-warn)',
        '#f97316': 'var(--clr-orange)',
        '#10b981': 'var(--clr-success)',
        '#22c55e': 'var(--clr-success)',
        '#166534': 'var(--clr-success)',
        '#3b82f6': 'var(--clr-info)',
        '#06b6d4': 'var(--clr-info)',
        '#2563EB': 'var(--clr-info)',
        '#60A5FA': 'var(--clr-info)',
        '#8b5cf6': 'var(--clr-mlm)',
        '#a855f7': 'var(--clr-mlm)',
        '#9333EA': 'var(--clr-mlm)',
        '#C084FC': 'var(--clr-mlm)',
        '#ec4899': 'var(--clr-pink, #ec4899)',
        '#121212': 'var(--clr-bg-base)',
        '#1a1a1a': 'var(--clr-bg-elevated)',
        '#0a0a0a': 'var(--clr-bg-base)',
        '#0f0f0f': 'var(--clr-bg-base)',
        '#1a1a2e': 'var(--clr-bg-elevated)',
        '#9ca3af': 'var(--clr-text-muted)',
        '#e5e5e5': 'var(--clr-text-main)',
        '#fff': 'white',
        '#ffffff': 'white',
        '#000': 'var(--clr-bg-base)',
        '#000000': 'var(--clr-bg-base)',
    }
    
    for hex_code, var_name in hex_replacements.items():
        content = re.sub(rf'{hex_code}\b', var_name, content, flags=re.IGNORECASE)
        
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
        return 1
    return 0

def main():
    root_dir = r"c:\Users\Gatita\OneDrive\Desktop\Web_SaidonClub\apps\web"
    updated_files = 0
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith('.module.css') or filename.endswith('.css'):
                filepath = os.path.join(dirpath, filename)
                updated_files += replace_colors_in_file(filepath)
                
    print(f"Total files updated: {updated_files}")

if __name__ == "__main__":
    main()
