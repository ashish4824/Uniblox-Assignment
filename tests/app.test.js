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