import re

file_path = r"c:\Users\Gatita\OneDrive\Desktop\Web_SaidonClub\apps\web\app\dashboard\Dashboard.module.css"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Admin theme
content = content.replace("rgba(255,107,0,0.06)", "var(--clr-orange-dim)")
content = content.replace("rgba(255,107,0,0.04)", "var(--clr-orange-dim)")
content = content.replace("rgba(59,130,246,0.06)", "var(--clr-info-dim)")
content = content.replace("rgba(139,92,246,0.06)", "var(--clr-mlm-dim)")
content = content.replace("rgba(34,197,94,0.06)", "var(--clr-success-dim)")
content = content.replace("rgba(99,102,241,0.03)", "var(--clr-info-dim)")
content = content.replace("rgba(255, 255, 255, 0.02)", "var(--clr-border)")
content = content.replace("rgba(255,255,255,0.1)", "var(--clr-bg-hover)")

# Orange variables
content = content.replace("rgba(255,107,0,0.2)", "var(--clr-orange-dim)")
content = content.replace("rgba(255,107,0,0.05)", "var(--clr-orange-dim)")
content = content.replace("rgba(255,107,0,0.4)", "var(--clr-orange-dim)")
content = content.replace("rgba(255,107,0,0.15)", "var(--clr-orange-dim)")
content = content.replace("rgba(255,107,0,0.3)", "var(--clr-orange-dim)")
content = content.replace("rgba(255,107,0,0.12)", "var(--clr-orange-dim)")
content = content.replace("rgba(255, 107, 0, 0.05)", "var(--clr-orange-dim)")
content = content.replace("rgba(255,107,0,0.25)", "var(--clr-orange-dim)")
content = content.replace("rgba(255, 107, 0, 0.7)", "var(--clr-orange-dim)")
content = content.replace("rgba(255, 107, 0, 0)", "var(--clr-orange-dim)")
content = content.replace("rgba(255,107,0,0.08)", "var(--clr-orange-dim)")
content = content.replace("rgba(255,107,0,0.02)", "var(--clr-orange-dim)")
content = content.replace("rgba(255, 107, 0, 0.4)", "var(--clr-orange-dim)")
content = content.replace("rgba(255, 107, 0, 0.1)", "var(--clr-orange-dim)")
content = content.replace("rgba(255, 107, 0, 0.3)", "var(--clr-orange-dim)")

# Success variables
content = content.replace("rgba(16, 185, 129, 0.12)", "var(--clr-success-dim)")
content = content.replace("rgba(16, 185, 129, 0.04)", "var(--clr-success-dim)")
content = content.replace("rgba(16, 185, 129, 0.3)", "var(--clr-success-glow)")
content = content.replace("rgba(16, 185, 129, 0.06)", "var(--clr-success-dim)")

content = content.replace("rgba(34, 197, 94, 0.08)", "var(--clr-success-dim)")
content = content.replace("rgba(34, 197, 94, 0.2)", "var(--clr-success-glow)")
content = content.replace("rgba(34, 197, 94, 0.1)", "var(--clr-success-dim)")
content = content.replace("rgba(34, 197, 94, 0.7)", "var(--clr-success-glow)")
content = content.replace("rgba(34, 197, 94, 0)", "var(--clr-success-dim)")

# Warn variables
content = content.replace("rgba(245, 158, 11, 0.15)", "var(--clr-warn-dim)")
content = content.replace("rgba(245, 158, 11, 0.05)", "var(--clr-warn-dim)")
content = content.replace("rgba(245, 158, 11, 0.4)", "var(--clr-warn-glow)")
content = content.replace("rgba(245, 158, 11, 0.1)", "var(--clr-warn-dim)")
content = content.replace("rgba(245, 158, 11, 0.8)", "var(--clr-warn-glow)")
content = content.replace("rgba(245, 158, 11, 0.2)", "var(--clr-warn-glow)")

# Info variables
content = content.replace("rgba(59,130,246,0.1)", "var(--clr-info-dim)")
content = content.replace("rgba(59,130,246,0.04)", "var(--clr-info-dim)")
content = content.replace("rgba(59,130,246,0.25)", "var(--clr-info-glow)")
content = content.replace("rgba(14, 165, 233, 0.1)", "var(--clr-info-dim)")
content = content.replace("rgba(14, 165, 233, 0.2)", "var(--clr-info-glow)")

# Shadows
content = content.replace("rgba(0,0,0,0.2)", "var(--clr-shadow)")
content = content.replace("rgba(0,0,0,0.25)", "var(--clr-shadow)")
content = content.replace("rgba(0,0,0,0.3)", "var(--clr-shadow)")
content = content.replace("rgba(0,0,0,0.1)", "var(--clr-shadow)")
content = content.replace("rgba(0, 0, 0, 0.1)", "var(--clr-shadow)")
content = content.replace("rgba(0, 0, 0, 0.05)", "var(--clr-shadow)")

# MLM variables
content = content.replace("rgba(168,85,247,0.25)", "var(--clr-mlm-dim)")
content = content.replace("rgba(168,85,247,0.35)", "var(--clr-mlm-glow)")
content = content.replace("rgba(139, 92, 246, 0.08)", "var(--clr-mlm-dim)")
content = content.replace("rgba(139, 92, 246, 0.25)", "var(--clr-mlm-glow)")
content = content.replace("rgba(139, 92, 246, 0.05)", "var(--clr-mlm-dim)")
content = content.replace("rgba(139, 92, 246, 0.03)", "var(--clr-mlm-dim)")
content = content.replace("rgba(139, 92, 246, 0.3)", "var(--clr-mlm-glow)")

# Text colors
content = content.replace("rgba(255, 255, 255, 0.8)", "var(--clr-text-secondary)")
content = content.replace("rgba(255, 255, 255, 0.5)", "var(--clr-text-muted)")
content = content.replace("rgba(255,255,255,0.08)", "var(--clr-border)")

# Buttons
content = content.replace("color: #000;", "color: var(--clr-text-on-brand);")
content = content.replace("color: #fff;", "color: var(--clr-text-inverse);")
content = content.replace("#ff8c00", "var(--clr-orange-light)")
content = content.replace("#ffb347", "var(--clr-orange-light)")
content = content.replace("#7e22ce", "var(--clr-mlm-light)")

# Some more opacities
content = content.replace("rgba(255, 255, 255, 0.05)", "var(--clr-border)")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
