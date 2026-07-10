# Desi Rasoi — API Simulation Layer

Since GitHub Pages serves only static files, **all backend operations are simulated** via a service layer that reads/writes to `localStorage`. This document defines the contract for that layer.

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌────────────────┐
│  React UI   │────▶│   Services   │────▶│  localStorage  │
│  Components │◀────│  (api/*.ts)  │◀────│  JSON store    │
└─────────────┘     └──────────────┘     └────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  seed.json   │  (initial data, bundled)
                    └──────────────┘
```

### Design Principles
1. **Service functions mirror REST APIs** — easy to swap for real backend later
2. **All functions return Promises** — simulates async network calls with `setTimeout(0)`
3. **Typed inputs/outputs** — full TypeScript coverage
4. **Single source of truth** — localStorage is the database
5. **Optimistic UI ready** — services are pure enough to support optimistic updates

---

## Storage Wrapper (`storage.ts`)

```typescript
const PREFIX = 'desi_rasoi_';

export function getItem<T>(key: string): T | null {
  const raw = localStorage.getItem(PREFIX + key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function removeItem(key: string): void {
  localStorage.removeItem(PREFIX + key);
}
```

---

## Service API Reference

### Products Service (`products.ts`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `getProducts` | `(filters?) => Promise<Product[]>` | List with optional category, search, sort |
| `getProductBySlug` | `(slug: string) => Promise<Product \| null>` | Single product |
| `getProductById` | `(id: string) => Promise<Product \| null>` | By ID |
| `createProduct` | `(data: Omit<Product, 'id' \| 'createdAt' \| 'updatedAt'>) => Promise<Product>` | Admin create |
| `updateProduct` | `(id: string, data: Partial<Product>) => Promise<Product>` | Admin update |
| `deleteProduct` | `(id: string) => Promise<void>` | Admin soft-delete (set active=false) |
| `adjustStock` | `(id: string, delta: number, reason: string) => Promise<Product>` | Inventory adjust |
| `getFeaturedProducts` | `() => Promise<Product[]>` | Home page featured |
| `getLowStockProducts` | `(threshold?: number) => Promise<Product[]>` | Admin alerts |

#### Example: `getProducts`
```typescript
export async function getProducts(filters?: {
  categoryId?: string;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'newest';
  activeOnly?: boolean;
}): Promise<Product[]> {
  await simulateDelay();
  let products = getItem<Product[]>('products') ?? [];

  if (filters?.activeOnly !== false) {
    products = products.filter(p => p.active);
  }
  if (filters?.categoryId) {
    products = products.filter(p => p.categoryId === filters.categoryId);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    products = products.filter(p =>
      p.nameEn.toLowerCase().includes(q) ||
      p.nameHi.includes(q)
    );
  }
  if (filters?.sort === 'price_asc') products.sort((a, b) => a.price - b.price);
  if (filters?.sort === 'price_desc') products.sort((a, b) => b.price - a.price);
  if (filters?.sort === 'name_asc') products.sort((a, b) => a.nameEn.localeCompare(b.nameEn));

  return products;
}
```

---

### Categories Service (`categories.ts`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `getCategories` | `() => Promise<Category[]>` | All active categories |
| `getCategoryBySlug` | `(slug: string) => Promise<Category \| null>` | Single category |
| `createCategory` | `(data) => Promise<Category>` | Admin create |
| `updateCategory` | `(id, data) => Promise<Category>` | Admin update |
| `deleteCategory` | `(id) => Promise<void>` | Admin delete (if no products) |

---

### Orders Service (`orders.ts`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `createOrder` | `(cart, address, customerId) => Promise<Order>` | Place order |
| `getOrders` | `(filters?) => Promise<Order[]>` | List orders |
| `getOrderById` | `(id: string) => Promise<Order \| null>` | Single order |
| `getOrdersByCustomer` | `(customerId: string) => Promise<Order[]>` | Customer history |
| `updateOrderStatus` | `(id, status, note?) => Promise<Order>` | Admin status change |
| `cancelOrder` | `(id: string) => Promise<Order>` | Cancel + restore stock |
| `getOrderStats` | `() => Promise<OrderStats>` | Dashboard KPIs |

#### Example: `createOrder`
```typescript
export async function createOrder(
  cartItems: CartItem[],
  address: ShippingAddress,
  customer: Customer
): Promise<Order> {
  await simulateDelay(200);

  const products = getItem<Product[]>('products') ?? [];

  // Validate stock
  for (const item of cartItems) {
    const product = products.find(p => p.id === item.productId);
    if (!product) throw new Error(`Product not found: ${item.productId}`);
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.nameEn}`);
    }
  }

  // Build order items
  const orderItems: OrderItem[] = cartItems.map(item => {
    const product = products.find(p => p.id === item.productId)!;
    return {
      productId: product.id,
      productName: product.nameEn,
      productImage: product.imageUrl,
      quantity: item.quantity,
      unitPrice: product.price,
      lineTotal: product.price * item.quantity,
    };
  });

  const subtotal = orderItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const deliveryFee = 49;
  const now = new Date().toISOString();

  const order: Order = {
    id: generateId('ord'),
    orderNumber: generateOrderNumber(),
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    status: 'placed',
    items: orderItems,
    shippingAddress: address,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    paymentMethod: 'cod',
    statusHistory: [{ status: 'placed', timestamp: now }],
    createdAt: now,
    updatedAt: now,
  };

  // Deduct stock
  for (const item of cartItems) {
    await adjustStock(item.productId, -item.quantity, `Order ${order.orderNumber}`);
  }

  // Save order
  const orders = getItem<Order[]>('orders') ?? [];
  orders.unshift(order);
  setItem('orders', orders);

  return order;
}
```

---

### Auth Service (`auth.ts`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `loginCustomer` | `(email, name) => Promise<Customer>` | Auto-register if new |
| `logoutCustomer` | `() => void` | Clear customer session |
| `getCurrentCustomer` | `() => Customer \| null` | Current session |
| `loginAdmin` | `(username, password) => Promise<boolean>` | Admin gate |
| `logoutAdmin` | `() => void` | Clear admin session |
| `isAdminLoggedIn` | `() => boolean` | Check admin session |

---

### Cart Service (`cart.ts`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `getCart` | `() => CartItem[]` | Read cart (sync, no delay) |
| `addToCart` | `(productId, qty?) => void` | Add or increment |
| `updateQuantity` | `(productId, qty) => void` | Set quantity |
| `removeFromCart` | `(productId) => void` | Remove item |
| `clearCart` | `() => void` | Empty cart |
| `getCartTotal` | `() => Promise<{ items, subtotal }>` | Enriched cart with product details |

---

### Seed Service (`seed.ts`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `initializeIfNeeded` | `() => void` | Load seed data on first visit |
| `resetAllData` | `() => void` | Clear all + re-seed (admin utility) |
| `exportData` | `() => string` | JSON export of all data |
| `importData` | `(json: string) => void` | JSON import |

```typescript
export function initializeIfNeeded(): void {
  if (getItem('initialized')) return;

  setItem('categories', seedData.categories);
  setItem('products', seedData.products);
  setItem('orders', seedData.sampleOrders ?? []);
  setItem('cart', []);
  setItem('initialized', true);
}
```

---

## Simulated Network Delay

```typescript
function simulateDelay(ms: number = 50): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

This makes loading states testable and the app feel more realistic.

---

## Error Handling

```typescript
export class ServiceError extends Error {
  constructor(
    message: string,
    public code: 'NOT_FOUND' | 'VALIDATION' | 'STOCK' | 'AUTH' | 'UNKNOWN'
  ) {
    super(message);
  }
}
```

UI layer catches `ServiceError` and shows appropriate toast messages.

---

## Migration Path to Real Backend

When ready to add a real API, replace service implementations:

```typescript
// Before (localStorage)
export async function getProducts() {
  return getItem<Product[]>('products') ?? [];
}

// After (Supabase example)
export async function getProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw new ServiceError(error.message, 'UNKNOWN');
  return data;
}
```

The function signatures stay the same — only the implementation changes. Components and hooks require zero modifications.

### Recommended Future Backend Options

| Option | Pros | Cons |
|--------|------|------|
| **Supabase** | Free tier, Postgres, auth, realtime | External dependency |
| **Firebase** | Easy setup, Firestore | NoSQL, vendor lock-in |
| **JSON Server** | Quick mock API | Needs separate hosting |
| **Cloudflare Workers + KV** | Edge, fast, free tier | More setup |

---

## Debug Namespace

```typescript
// Available in dev mode on window
window.__DESI_RASOI__ = {
  getProducts: () => getItem('products'),
  getOrders: () => getItem('orders'),
  resetData: () => resetAllData(),
  exportData: () => exportData(),
};
```

Access in browser console: `__DESI_RASOI__.getOrders()`
