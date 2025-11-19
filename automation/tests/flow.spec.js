const { test, expect } = require('@playwright/test')

test('smoke: stats API responds with JSON', async ({ request }) => {
  const base = process.env.TEST_URL
  if (!base) test.skip()
  const url = new URL('/admin/stats', base).toString()
  const resp = await request.get(url)
  expect(resp.ok()).toBeTruthy()
  const json = await resp.json()
  expect(json).toMatchObject({
    itemsPurchasedCount: expect.any(Number),
    totalPurchaseAmount: expect.any(Number),
    totalDiscountAmount: expect.any(Number)
  })
})