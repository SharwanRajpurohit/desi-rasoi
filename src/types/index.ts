// ─── Order Status ──────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

// ─── Category ──────────────────────────────────────────────────────────────────

export interface Category {
  id: string
  slug: string
  nameEn: string
  nameHi: string
  icon: string
  sortOrder: number
  active: boolean
}

// ─── Product ───────────────────────────────────────────────────────────────────

export interface Product {
  id: string
  slug: string
  nameEn: string
  nameHi: string
  description: string
  categoryId: string
  price: number
  stock: number
  imageUrl: string
  featured: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}

// ─── Customer ──────────────────────────────────────────────────────────────────

export interface Customer {
  id: string
  email: string
  name: string
  phone?: string
  createdAt: string
}

// ─── Cart ──────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string
  quantity: number
}

export interface CartItemEnriched extends CartItem {
  product: Product
  lineTotal: number
}

export interface CartSummary {
  items: CartItemEnriched[]
  subtotal: number
  deliveryFee: number
  total: number
  itemCount: number
}

// ─── Order ─────────────────────────────────────────────────────────────────────

export interface ShippingAddress {
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  notes?: string
}

export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export interface StatusHistoryEntry {
  status: OrderStatus
  timestamp: string
  note?: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  status: OrderStatus
  items: OrderItem[]
  shippingAddress: ShippingAddress
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: 'cod'
  statusHistory: StatusHistoryEntry[]
  createdAt: string
  updatedAt: string
}

// ─── Admin ─────────────────────────────────────────────────────────────────────

export interface AdminSession {
  loggedIn: boolean
  username: string
  timestamp: string
}

// ─── Stock Log ─────────────────────────────────────────────────────────────────

export interface StockLogEntry {
  productId: string
  previousStock: number
  newStock: number
  reason: string
  timestamp: string
}

// ─── Dashboard Stats ───────────────────────────────────────────────────────────

export interface OrderStats {
  totalOrders: number
  todayOrders: number
  totalRevenue: number
  todayRevenue: number
  pendingOrders: number
  lowStockCount: number
}

// ─── Product Filters ───────────────────────────────────────────────────────────

export type SortOption = 'price_asc' | 'price_desc' | 'name_asc' | 'newest'

export interface ProductFilters {
  categorySlug?: string
  categoryId?: string
  search?: string
  sort?: SortOption
  featuredOnly?: boolean
  activeOnly?: boolean
}

// ─── Review ────────────────────────────────────────────────────────────────────

export interface Review {
  id: string
  productId: string
  customerId: string
  customerName: string
  rating: number          // 1–5
  comment: string
  createdAt: string
}

// ─── Wishlist ──────────────────────────────────────────────────────────────────

export type WishlistItem = string   // productId
