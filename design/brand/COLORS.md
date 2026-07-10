# Desi Rasoi — Brand & Color Guide

## Brand Identity

**Name:** Desi Rasoi (देसी रसोई)  
**Tagline:** *Taste of Rajasthan, Delivered to Your Door*  
**Hindi Tagline:** *राजस्थान का स्वाद, आपके द्वार*

**Brand Personality:**
- Warm & welcoming — like a Rajasthani home kitchen
- Authentic & heritage-rich — rooted in tradition
- Modern & trustworthy — clean e-commerce experience
- Premium but accessible — quality food at fair prices

---

## Color Palette

Inspired by Rajasthani culture: terracotta havelis, marigold garlands, desert sand, royal reds, and indigo block prints.

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Terracotta** | `#C45C26` | 196, 92, 38 | Primary buttons, links, accents |
| **Terracotta Dark** | `#9A4520` | 154, 69, 32 | Hover states, active nav |
| **Terracotta Light** | `#E8A06A` | 232, 160, 106 | Badges, highlights |

### Secondary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Marigold** | `#E8A317` | 232, 163, 23 | Featured tags, sale badges |
| **Royal Red** | `#B91C1C` | 185, 28, 28 | Sale prices, alerts, out-of-stock |
| **Indigo** | `#1E3A5F` | 30, 58, 95 | Admin sidebar, headings |

### Neutral Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Sand** | `#FDF6EC` | 253, 246, 236 | Page background |
| **Sand Dark** | `#F5E6D0` | 245, 230, 208 | Card backgrounds, sections |
| **Warm Gray** | `#78716C` | 120, 113, 108 | Secondary text |
| **Charcoal** | `#292524` | 41, 37, 36 | Primary text |
| **White** | `#FFFFFF` | 255, 255, 255 | Cards, modals, inputs |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Success** | `#16A34A` | Order delivered, in stock |
| **Warning** | `#D97706` | Low stock, pending |
| **Error** | `#DC2626` | Form errors, cancelled |
| **Info** | `#2563EB` | Order confirmed, info banners |

---

## Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#C45C26',
          dark: '#9A4520',
          light: '#E8A06A',
        },
        marigold: '#E8A317',
        royal: '#B91C1C',
        indigo: {
          DEFAULT: '#1E3A5F',
          light: '#2D5F8A',
        },
        sand: {
          DEFAULT: '#FDF6EC',
          dark: '#F5E6D0',
        },
        warm: {
          gray: '#78716C',
        },
        charcoal: '#292524',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

---

## Typography

### Font Pairing

| Role | Font | Weight | Size Range |
|------|------|--------|------------|
| H1 (Hero) | Playfair Display | 700 | 36–48px |
| H2 (Section) | Playfair Display | 600 | 28–32px |
| H3 (Card title) | Playfair Display | 600 | 20–24px |
| Body | Inter | 400 | 16px |
| Small / Caption | Inter | 400 | 12–14px |
| Price | Inter | 700 | 18–24px |
| Hindi text | Noto Sans Devanagari | 400 | 16px |

### Google Fonts Import
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
```

---

## Spacing & Layout

| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | 4px | Icon gaps |
| `space-sm` | 8px | Inline spacing |
| `space-md` | 16px | Card padding |
| `space-lg` | 24px | Section gaps |
| `space-xl` | 32px | Section padding |
| `space-2xl` | 48px | Hero padding |
| `space-3xl` | 64px | Page sections |

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 4px | Badges, tags |
| `rounded-md` | 8px | Buttons, inputs |
| `rounded-lg` | 12px | Cards |
| `rounded-xl` | 16px | Modals, hero cards |
| `rounded-full` | 9999px | Avatars, pills |

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(41, 37, 36, 0.05);
--shadow-md: 0 4px 12px rgba(41, 37, 36, 0.08);
--shadow-lg: 0 8px 24px rgba(41, 37, 36, 0.12);
--shadow-card: 0 2px 8px rgba(196, 92, 38, 0.08);
```

---

## Patterns & Textures

- **Background pattern:** Subtle Rajasthani block-print motif at 3% opacity on hero and section dividers
- **Dividers:** Thin line with small diamond (◆) center ornament
- **Category cards:** Rounded with icon emoji + gradient overlay on hover

---

## Logo Concept

```
┌─────────────────────────┐
│   🏺                    │
│   Desi Rasoi            │
│   देसी रसोई              │
└─────────────────────────┘
```

- **Icon:** Traditional clay pot (matka) or mortar-pestle silhouette
- **Wordmark:** "Desi Rasoi" in Playfair Display
- **Subtext:** "देसी रसोई" in Noto Sans Devanagari, smaller, below
- **Colors:** Terracotta icon + Charcoal text

---

## Imagery Guidelines

- Use warm, well-lit food photography
- Prefer overhead and 45° angles
- Show traditional serving ware (brass, clay, leaf plates)
- Include Rajasthani context where possible (bandhani cloth, desert backdrop)
- Placeholder: Unsplash search terms — "indian sweets", "rajasthani food", "indian spices"

---

## Admin Theme Variant

The admin panel uses a more subdued, professional palette:

| Element | Color |
|---------|-------|
| Sidebar background | Indigo `#1E3A5F` |
| Sidebar text | White |
| Sidebar active item | Terracotta `#C45C26` |
| Content background | `#F8FAFC` (cool gray) |
| Cards | White with shadow-md |

This visually separates admin from the customer experience.
