const request = require('supertest')
const app = require('../src/app')
const store = require('../src/store')

beforeEach(() => {
  store.reset()
})

test('add items to cart and retrieve', async () => {
  await request(app).post('/cart/u1/items').send({ name: 'Alpha', price: 100, quantity: 2 }).expect(201)
  const res = await request(app).get('/cart/u1').expect(200)
  expect(res.body.cart.length).toBe(1)
  expect(res.body.cart[0].total).toBeUndefined()
})

test('checkout without discount', async () => {
  await request(app).post('/cart/u1/items').send({ name: 'Alpha', price: 50, quantity: 2 }).expect(201)
  const res = await request(app).post('/checkout/u1').send({}).expect(201)
  expect(res.body.order.total).toBe(100)
})

test('cannot generate discount before threshold', async () => {
  const r = await request(app).post('/admin/discounts/generate').send({}).expect(400)
  expect(r.body.error).toBe('not_available')
})

test('generate discount at nth order, apply once', async () => {
  for (let i = 0; i < store.state.n; i++) {
    await request(app).post(`/cart/u${i}/items`).send({ name: 'Item', price: 10, quantity: 1 }).expect(201)
    await request(app).post(`/checkout/u${i}`).send({}).expect(201)
  }
  const gen = await request(app).post('/admin/discounts/generate').send({}).expect(201)
  const code = gen.body.discount.code

  await request(app).post('/cart/uX/items').send({ name: 'Item', price: 100, quantity: 1 }).expect(201)
  const withCode = await request(app).post('/checkout/uX').send({ discountCode: code }).expect(201)
  expect(withCode.body.order.total).toBe(90)

  await request(app).post('/cart/uY/items').send({ name: 'Item', price: 50, quantity: 1 }).expect(201)
  const invalid = await request(app).post('/checkout/uY').send({ discountCode: code }).expect(400)
  expect(invalid.body.error).toBe('invalid_discount')
})

test('stats show purchases and discounts', async () => {
  await request(app).post('/cart/u1/items').send({ name: 'A', price: 20, quantity: 2 }).expect(201)
  await request(app).post('/checkout/u1').send({}).expect(201)
  const s = await request(app).get('/admin/stats').expect(200)
  expect(s.body.itemsPurchasedCount).toBe(2)
  expect(s.body.totalPurchaseAmount).toBe(40)
  expect(Array.isArray(s.body.discountCodes)).toBe(true)
})

test('remove item from cart', async () => {
  // Add item to cart
  const addRes = await request(app).post('/cart/u1/items').send({ name: 'Alpha', price: 100, quantity: 2 }).expect(201)
  const itemId = addRes.body.cart[0].id

  // Verify item is in cart
  let cartRes = await request(app).get('/cart/u1').expect(200)
  expect(cartRes.body.cart.length).toBe(1)

  // Remove item
  await request(app).delete(`/cart/u1/items/${itemId}`).expect(200)

  // Verify cart is empty
  cartRes = await request(app).get('/cart/u1').expect(200)
  expect(cartRes.body.cart.length).toBe(0)
})

test('remove non-existent item returns 404', async () => {
  const res = await request(app).delete('/cart/u1/items/fake-id').expect(404)
  expect(res.body.error).toBe('item_not_found')
})

test('update item quantity in cart', async () => {
  // Add item to cart
  const addRes = await request(app).post('/cart/u1/items').send({ name: 'Alpha', price: 100, quantity: 2 }).expect(201)
  const itemId = addRes.body.cart[0].id

  // Update quantity
  const updateRes = await request(app).patch(`/cart/u1/items/${itemId}`).send({ quantity: 5 }).expect(200)
  expect(updateRes.body.cart[0].quantity).toBe(5)

  // Verify in cart
  const cartRes = await request(app).get('/cart/u1').expect(200)
  expect(cartRes.body.cart[0].quantity).toBe(5)
})

test('update with invalid quantity returns 400', async () => {
  // Add item to cart
  const addRes = await request(app).post('/cart/u1/items').send({ name: 'Alpha', price: 100, quantity: 2 }).expect(201)
  const itemId = addRes.body.cart[0].id

  // Try to update with invalid quantity
  const res = await request(app).patch(`/cart/u1/items/${itemId}`).send({ quantity: -1 }).expect(400)
  expect(res.body.error).toBe('invalid_quantity')
})

test('checkout with empty cart returns 400', async () => {
  const res = await request(app).post('/checkout/u1').send({}).expect(400)
  expect(res.body.error).toBe('empty_cart')
})

test('add invalid item returns 400', async () => {
  // Missing price
  let res = await request(app).post('/cart/u1/items').send({ name: 'Alpha', quantity: 2 }).expect(400)
  expect(res.body.error).toBe('invalid_item')

  // Invalid price
  res = await request(app).post('/cart/u1/items').send({ name: 'Alpha', price: -10, quantity: 2 }).expect(400)
  expect(res.body.error).toBe('invalid_item')

  // Invalid quantity
  res = await request(app).post('/cart/u1/items').send({ name: 'Alpha', price: 100, quantity: 0 }).expect(400)
  expect(res.body.error).toBe('invalid_item')
})