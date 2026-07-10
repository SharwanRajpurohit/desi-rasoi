# Desi Rasoi — UI Component Library

Component specifications for the React implementation. All components live in `src/components/`.

---

## Component Hierarchy

```
components/
├── ui/                    # Primitive, reusable
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Textarea.tsx
│   ├── Badge.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Toast.tsx
│   ├── Skeleton.tsx
│   ├── Spinner.tsx
│   ├── EmptyState.tsx
│   └── Pagination.tsx
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── CustomerLayout.tsx
│   ├── AdminLayout.tsx
│   ├── AdminSidebar.tsx
│   └── MobileNav.tsx
├── customer/
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── CategoryCard.tsx
│   ├── CartItem.tsx
│   ├── CartSummary.tsx
│   ├── OrderCard.tsx
│   ├── OrderTimeline.tsx
│   ├── SearchBar.tsx
│   ├── FilterChips.tsx
│   └── HeroBanner.tsx
└── admin/
    ├── KpiCard.tsx
    ├── DataTable.tsx
    ├── ProductForm.tsx
    ├── OrderTable.tsx
    ├── StatusBadge.tsx
    ├── StatusSelect.tsx
    ├── StockAdjuster.tsx
    └── ConfirmDialog.tsx
```

---

## UI Primitives

### Button

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Shows spinner |
| `fullWidth` | `boolean` | `false` | 100% width |
| `icon` | `ReactNode` | — | Left icon |
| `onClick` | `() => void` | — | Click handler |

**Variants:**
- `primary` — Terracotta bg, white text
- `secondary` — Marigold bg, charcoal text
- `outline` — Terracotta border, transparent bg
- `ghost` — No border, terracotta text
- `danger` — Royal red bg, white text

---

### Input

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Field label |
| `error` | `string` | Error message below |
| `type` | `string` | HTML input type |
| `placeholder` | `string` | Placeholder text |
| `required` | `boolean` | Required indicator |

---

### Badge

| Prop | Type | Description |
|------|------|-------------|
| `variant` | `'default' \| 'success' \| 'warning' \| 'error' \| 'info'` | Color |
| `size` | `'sm' \| 'md'` | Size |

**Usage examples:**
- `In Stock` → success (green)
- `Low Stock` → warning (amber)
- `Out of Stock` → error (red)
- `Featured` → default (terracotta)
- `Preparing` → info (blue)

---

### Card (ProductCard layout)

- Image area with 4:3 aspect ratio
- Product name in Playfair Display
- Hindi subtitle in warm gray
- Price in bold + stock Badge
- Full-width "Add to Cart" button
- `shadow-card`, `rounded-lg`, hover lift transition

---

### Modal

- Backdrop: black/50, click to close
- Animation: fade + scale from 95% to 100%
- Used for delete confirmations

---

### Toast

Position: top-right, stacked, auto-dismiss after 4s.

| Variant | Icon | Color |
|---------|------|-------|
| success | ✓ | Green left border |
| error | ✕ | Red left border |
| info | ℹ | Blue left border |

---

## Customer Components

### OrderTimeline

Visual stepper showing order progress.

| Prop | Type | Description |
|------|------|-------------|
| `currentStatus` | `OrderStatus` | Current status |
| `history` | `StatusHistoryEntry[]` | Full history with timestamps |

Steps: Placed → Confirmed → Preparing → Out for Delivery → Delivered

---

### HeroBanner

- Background: gradient(terracotta → marigold)
- Pattern overlay at 3% opacity
- Headline: "Taste of Rajasthan, Delivered to Your Door"
- CTAs: "Shop Now" + "View Categories"

---

## Admin Components

### KpiCard

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | KPI label |
| `value` | `string \| number` | Main number |
| `change` | `string` | Delta text |
| `icon` | `ReactNode` | Lucide icon |

---

### DataTable

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `Column[]` | Column definitions |
| `data` | `T[]` | Row data |
| `onRowClick` | `(row) => void` | Row click handler |
| `searchable` | `boolean` | Show search input |
| `pageSize` | `number` | Rows per page |

---

### StatusBadge

| Status | Label | Variant |
|--------|-------|---------|
| `placed` | Placed | info |
| `confirmed` | Confirmed | info |
| `preparing` | Preparing | warning |
| `out_for_delivery` | Out for Delivery | warning |
| `delivered` | Delivered | success |
| `cancelled` | Cancelled | error |

---

## Responsive Behavior

| Component | Mobile | Desktop |
|-----------|--------|---------|
| Header | Logo + cart + hamburger | Full nav links |
| ProductGrid | 1 column | 3 columns |
| AdminSidebar | Hidden (hamburger) | Fixed 240px |
| DataTable | Card list view | Full table |
| Checkout | Stacked | 2-column |
| HeroBanner | Smaller text, stacked CTAs | Full width |

---

## Animation Guidelines

| Interaction | Animation | Duration |
|-------------|-----------|----------|
| Button hover | Background darken | 150ms |
| Card hover | Shadow lift + translateY(-2px) | 200ms |
| Modal open | Fade + scale | 200ms |
| Toast enter | Slide from right | 300ms |
| Page transition | Fade | 150ms |
| Skeleton | Pulse opacity | 1.5s loop |
| Cart count | Scale bounce | 300ms |

---

## Icon Usage (Lucide React)

| Context | Icon |
|---------|------|
| Cart | `ShoppingCart` |
| Search | `Search` |
| User / Login | `User` |
| Orders | `Package` |
| Add | `Plus` |
| Remove | `Trash2` |
| Edit | `Pencil` |
| Close | `X` |
| Dashboard | `LayoutDashboard` |
| Products | `ShoppingBag` |
| Inventory | `Warehouse` |
| Delivery | `Truck` |
