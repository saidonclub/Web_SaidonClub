# 🎨 SaidonClub Design System — Obsidian & Safety Orange
> **Version:** 1.1.0  
> **Aesthetic:** Ultra-Luxury, Performance, and Forensic Precision.

---

## 🌑 1. The Color Palette: Obsidian Mastery
The SaidonClub identity is built on a "Dark Mode First" philosophy, using deep obsidian tones contrasted with vibrant industrial orange.

### Primary Tones (Obsidian)
- **Base BG:** `#0A0A0A` — The foundation of the system.
- **Card BG:** `#121212` — Subtle elevation.
- **Glass BG:** `rgba(10, 10, 10, 0.75)` — Used for overlays with `backdrop-filter: blur(20px)`.
- **Border Glass:** `rgba(255, 255, 255, 0.08)` — Precise, sharp edges.

### Accent Tones (Safety Orange)
- **Primary:** `#FF4D00` — High-visibility industrial orange.
- **Hover:** `#FF5E1A` — Energetic interaction state.
- **Dim:** `rgba(255, 77, 0, 0.1)` — Used for background tints on active elements.
- **Glow:** `0 0 20px rgba(255, 77, 0, 0.3)` — Subtle radiance for primary CTAs.

---

## 🖋️ 2. Typography: The Inter Standard
We use **Inter** for its mathematical precision and exceptional legibility at small sizes.

- **Headings:** `Inter Bold` (700) or `ExtraBold` (800) with `-0.02em` letter spacing.
- **Body:** `Inter Regular` (400) or `Medium` (500).
- **Data/Metrics:** `Inter SemiBold` (600) for numeric values.

### Type Scale
- **H1 (Mega):** 40px / 1.1 Line Height
- **H2 (Section):** 32px / 1.2 Line Height
- **H3 (Subsection):** 24px / 1.3 Line Height
- **Body Large:** 18px
- **Body Base:** 16px
- **Body Small:** 14px
- **Tiny/Label:** 12px

---

## 🧊 3. Visual Language: Glassmorphism Pro
All panels and interactive surfaces must follow the "Forensic Glass" standard.

### The Glass Component
```css
.glass-panel {
  background: var(--clr-bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--clr-border-glass);
  border-radius: var(--radius-md);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}
```

### Motion & Physics
- **Transitions:** `0.3s cubic-bezier(0.4, 0, 0.2, 1)` for all transforms.
- **Hover:** Subtle scaling (`scale(1.02)`) and brightness boost.
- **Entrance:** Use `Framer Motion` for staggered list animations and fade-in slides.

---

## 📐 4. Layout & Breakpoints
- **Compact Mobile:** `< 480px` (Maximized touch hitboxes: min 44px).
- **Tablet/Small Laptop:** `480px - 1024px`.
- **Desktop Mastery:** `1024px - 1440px`.
- **Ultra-Wide:** `> 1440px` (Max container width 1280px).

---

## 🛡️ 5. Implementation Commandments
1.  **Zero Hex Hardcoding:** Only CSS variables are allowed in components.
2.  **Obsidian Contrast:** Ensure all text passes WCAG AA contrast against dark backgrounds.
3.  **Skeleton First:** Every data-fetching component must have a matching Skeleton state.
4.  **Forensic Alignment:** Use a strict 4px/8px grid system for all padding and margins.

---

## 📸 6. Imagery & Brand Representation
The imagery must precisely reflect the nature of the SaidonClub business model. 
- **Marketplace Products:** SaidonClub is an online marketplace for **various non-perishable goods** (technology, gadgets, modern home accessories, fashion, etc.). 
- **Rule of Thumb:** Background banners, placeholders, and promotional images must NEVER show absurd or out-of-context scenes (e.g., a cozy dimly-lit living room lamp background is unacceptable for a general products banner). 
- **Visuals:** Use sleek, abstract, modern e-commerce elements, neon grids, sleek boxes, premium gadgets, or clean digital shopping metaphors that match the dark mode aesthetic.

---

*Style Guide maintained by Antigravity Design Engine.*
