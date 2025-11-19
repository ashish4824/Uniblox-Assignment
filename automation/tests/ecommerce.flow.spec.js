const { test, expect } = require('@playwright/test')
test.describe.configure({ mode: 'serial' })

test('ecommerce end-to-end with discounts', async ({ request }) => {
  const base = process.env.TEST_URL
  if (!base) test.skip()
  const url = (p) => new URL(p, base).toString()

  await request.post(url('/admin/reset'))

  for (let i = 0; i < 2; i++) {
    await request.post(url(`/cart/u${i}/items`), { data: { name: 'Item', price: 10, quantity: 1 } })
    const o = await request.post(url(`/checkout/u${i}`), { data: {} })
    expect(o.ok()).toBeTruthy()
  }

  const genEarly = await request.post(url('/admin/discounts/generate'))
  expect(genEarly.status()).toBe(400)

  await request.post(url(`/cart/u2/items`), { data: { name: 'Item', price: 10, quantity: 1 } })
  await request.post(url(`/checkout/u2`), { data: {} })

  const gen = await request.post(url('/admin/discounts/generate'))
  expect(gen.ok()).toBeTruthy()
  const code = (await gen.json()).discount.code

  await request.post(url(`/cart/uX/items`), { data: { name: 'Item', price: 100, quantity: 1 } })
  const withCode = await request.post(url(`/checkout/uX`), { data: { discountCode: code } })
  expect(withCode.ok()).toBeTruthy()
  const order = await withCode.json()
  expect(order.order.total).toBe(90)

  const stats = await request.get(url('/admin/stats'))
  const s = await stats.json()
  expect(s.itemsPurchasedCount).toBeGreaterThan(0)
})