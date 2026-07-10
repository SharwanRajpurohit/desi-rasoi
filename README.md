# Desi Rasoi — Design Repository

> **Traditional Rajasthani Food E-commerce** — Static website design & development plan for GitHub Pages demo.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Ready-2ea44f)](https://pages.github.com/)
[![React](https://img.shields.io/badge/React-18+-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5+-646cff)](https://vitejs.dev/)

**Live demo:** https://sharwanrajpurohit.github.io/desi-rasoi/

---

## Overview

**Desi Rasoi** is a demo e-commerce platform for authentic traditional Rajasthani food products — *dal baati churma*, *ghevar*, *ker sangri*, *bajra roti*, *mawa kachori*, pickles, papad, and more.

This repository contains the **complete design specification** and a **working React scaffold** (Phase 0 complete) for a static site on **GitHub Pages**, with separate **Customer** and **Admin** experiences.

| Attribute | Value |
|-----------|-------|
| **Type** | Static SPA (React + Vite) |
| **Hosting** | GitHub Pages |
| **Data** | Client-side (localStorage + JSON seed) |
| **Auth** | Demo-only (localStorage session) |
| **Target** | Portfolio / demo / pitch deck |
| **Status** | Phase 0 complete — scaffold live |

---

## Getting Started

```bash
git clone https://github.com/SharwanRajpurohit/desi-rasoi.git
cd desi-rasoi
npm install
npm run dev          # Local dev server at http://localhost:5173
npm run build        # Production build → dist/
npm run preview      # Preview production build
```

**Requirements:** Node.js 18+ (20 LTS recommended)

---

## Repository Structure

```
desi-rasoi/
├── src/                         ← React application
│   ├── pages/customer/          ← Customer pages
│   ├── pages/admin/             ← Admin pages
│   └── data/seed.json           ← Sample product data
├── docs/                        ← Design & development docs
├── design/brand/                ← Brand guide & components
├── public/                      ← Static assets
├── .github/workflows/pages.yml  ← GitHub Pages deploy
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
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

## Tech Stack

| Layer | Choice | Status |
|-------|--------|--------|
| Framework | React 18 + Vite | ✅ Configured |
| Routing | React Router v6 | ✅ Customer + admin routes |
| Styling | Tailwind CSS | ✅ Brand tokens applied |
| State | React Context + hooks | Phase 2 |
| Persistence | localStorage | Phase 1 |
| Icons | Lucide React | ✅ Installed |
| Deploy | GitHub Actions → Pages | ✅ Workflow ready |

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
