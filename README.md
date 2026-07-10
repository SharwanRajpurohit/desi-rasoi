# Desi Rasoi — Design Repository

> **Traditional Rajasthani Food E-commerce** — Static website design & development plan for GitHub Pages demo.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Ready-2ea44f)](https://pages.github.com/)
[![React](https://img.shields.io/badge/React-18+-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5+-646cff)](https://vitejs.dev/)

---

## Overview

**Desi Rasoi** is a demo e-commerce platform for authentic traditional Rajasthani food products — *dal baati churma*, *ghevar*, *ker sangri*, *bajra roti*, *mawa kachori*, pickles, papad, and more.

This repository contains the **complete design specification** and **development plan** for building a static site hosted on **GitHub Pages**, with separate **Customer** and **Admin** experiences.

| Attribute | Value |
|-----------|-------|
| **Type** | Static SPA (React + Vite) |
| **Hosting** | GitHub Pages |
| **Data** | Client-side (localStorage + JSON seed) |
| **Auth** | Demo-only (localStorage session) |
| **Target** | Portfolio / demo / pitch deck |

---

## Repository Structure

```
desi-rasoi/
├── README.md                    ← You are here
├── docs/
│   ├── DESIGN.md                ← Full design specification
│   ├── DEVELOPMENT-PLAN.md      ← Phased build plan
│   ├── WIREFRAMES.md            ← Page layouts & user flows
│   ├── DATA-MODEL.md            ← Entities, schemas, sample data
│   └── API-SIMULATION.md        ← How static "backend" works
├── design/
│   ├── brand/
│   │   ├── COLORS.md            ← Color palette & typography
│   │   └── COMPONENTS.md        ← UI component library spec
│   └── assets/
│       └── mockups/             ← Placeholder for future mockups
└── .github/
    └── workflows/
        └── pages.yml            ← GitHub Pages deploy workflow (planned)
```

---

## Quick Links

| Document | Description |
|----------|-------------|
| [Design Specification](docs/DESIGN.md) | Architecture, features, tech stack, routing |
| [Development Plan](docs/DEVELOPMENT-PLAN.md) | 6-phase build roadmap with tasks & estimates |
| [Wireframes](docs/WIREFRAMES.md) | Customer & admin page layouts |
| [Data Model](docs/DATA-MODEL.md) | Products, orders, users, inventory schemas |
| [API Simulation](docs/API-SIMULATION.md) | localStorage service layer design |
| [Brand Guide](design/brand/COLORS.md) | Rajasthan-inspired visual identity |
| [Components](design/brand/COMPONENTS.md) | Reusable UI component specs |

---

## Two Endpoints

### Customer (`/`)
- Product catalog with categories
- Product detail pages
- Shopping cart
- Checkout & place order
- Order history
- Live order status tracking

### Admin (`/admin`)
- Dashboard with KPIs
- Add / edit / delete products
- Inventory management (stock levels, low-stock alerts)
- Order management (view all, update status)
- Category management

---

## Tech Stack (Planned)

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React 18 + Vite | Fast dev, SPA routing, GitHub Pages compatible |
| Routing | React Router v6 | Customer + admin route separation |
| Styling | Tailwind CSS | Rapid UI, responsive, brand tokens |
| State | React Context + hooks | Cart, auth, orders — no server needed |
| Persistence | localStorage | Demo data survives page refresh |
| Icons | Lucide React | Lightweight, consistent |
| Deploy | GitHub Actions → Pages | Free, automatic on push to `main` |

---

## Getting Started (After Implementation)

```bash
git clone https://github.com/<your-username>/desi-rasoi.git
cd desi-rasoi
npm install
npm run dev          # Local dev server
npm run build        # Production build → dist/
npm run preview      # Preview production build
```

---

## Demo Credentials (Planned)

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `desirasoi2026` |
| Customer | Any email | Any password (auto-register) |

> ⚠️ Demo auth is client-side only — not suitable for production.

---

## License

MIT — Free to use for demos and learning.

---

*Built with ❤️ for Rajasthani heritage food.*
