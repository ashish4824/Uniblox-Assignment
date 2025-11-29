const { v4: uuidv4 } = require('uuid')

const defaultN = 3

const state = {
  carts: new Map(),
  orders: [],
  discounts: [],
  n: defaultN,
  nextThreshold: defaultN
}

function setN(n) {
  if (!Number.isInteger(n) || n <= 0) throw new Error('invalid_n')
  state.n = n
  state.nextThreshold = n
}

function reset() {
  state.carts = new Map()
  state.orders = []
  state.discounts = []
  state.n = defaultN
  state.nextThreshold = defaultN
}

function addToCart(userId, item) {
  const { name, price, quantity, id } = item
  if (!name || typeof price !== 'number' || price <= 0 || !Number.isInteger(quantity) || quantity <= 0) {
    throw new Error('invalid_item')
  }
  const cart = state.carts.get(userId) || []
  const itemId = id || uuidv4()
  cart.push({ id: itemId, name, price, quantity })
  state.carts.set(userId, cart)
  return cart
}

function getCart(userId) {
  return state.carts.get(userId) || []
}

function removeFromCart(userId, itemId) {
  const cart = state.carts.get(userId) || []
  const index = cart.findIndex(item => item.id === itemId)
  if (index === -1) throw new Error('item_not_found')
  cart.splice(index, 1)
  state.carts.set(userId, cart)
  return cart
}

function updateCartItem(userId, itemId, updates) {
  const cart = state.carts.get(userId) || []
  const item = cart.find(item => item.id === itemId)
  if (!item) throw new Error('item_not_found')
  if (updates.quantity !== undefined) {
    if (!Number.isInteger(updates.quantity) || updates.quantity <= 0) {
      throw new Error('invalid_quantity')
    }
    item.quantity = updates.quantity
  }
  state.carts.set(userId, cart)
  return cart
}

function clearCart(userId) {
  state.carts.delete(userId)
}

function findActiveUnusedDiscount() {
  return state.discounts.find(d => d.used === false) || null
}

function canGenerateDiscount() {
  const active = findActiveUnusedDiscount()
  if (active) return false
  return state.orders.length >= state.nextThreshold
}

function generateDiscount() {
  if (!canGenerateDiscount()) throw new Error('cannot_generate')
  const code = `CODE-${uuidv4().slice(0, 8).toUpperCase()}`
  const discount = { code, percentage: 0.10, used: false, generatedAtOrderCount: state.orders.length }
  state.discounts.push(discount)
  state.nextThreshold += state.n
  return discount
}

function checkout(userId, discountCode) {
  const cart = getCart(userId)
  if (!cart.length) throw new Error('empty_cart')
  const subtotal = cart.reduce((s, it) => s + it.price * it.quantity, 0)
  let discountAmount = 0
  let codeUsed = null
  if (discountCode) {
    const d = state.discounts.find(x => x.code === discountCode)
    if (!d || d.used) throw new Error('invalid_discount')
    discountAmount = Math.round(subtotal * d.percentage * 100) / 100
    d.used = true
    codeUsed = d.code
  }
  const total = Math.round((subtotal - discountAmount) * 100) / 100
  const order = { id: uuidv4(), userId, items: cart, subtotal, discount: discountAmount, total, codeUsed, createdAt: Date.now() }
  state.orders.push(order)
  clearCart(userId)
  return order
}

function stats() {
  const itemsPurchasedCount = state.orders.reduce((sum, o) => sum + o.items.reduce((s, it) => s + it.quantity, 0), 0)
  const totalPurchaseAmount = state.orders.reduce((sum, o) => sum + o.total, 0)
  const totalDiscountAmount = state.orders.reduce((sum, o) => sum + o.discount, 0)
  return {
    itemsPurchasedCount,
    totalPurchaseAmount: Math.round(totalPurchaseAmount * 100) / 100,
    totalDiscountAmount: Math.round(totalDiscountAmount * 100) / 100,
    discountCodes: state.discounts.map(d => ({ code: d.code, used: d.used }))
  }
}

module.exports = { state, setN, reset, addToCart, getCart, removeFromCart, updateCartItem, checkout, canGenerateDiscount, generateDiscount, stats }