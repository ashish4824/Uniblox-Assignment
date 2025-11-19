const express = require('express')
const { addToCart, getCart, checkout, canGenerateDiscount, generateDiscount, stats, reset } = require('./store')

const app = express()
app.use(express.json())

app.post('/cart/:userId/items', (req, res) => {
  try {
    const cart = addToCart(req.params.userId, req.body)
    res.status(201).json({ cart })
  } catch (e) {
    if (e.message === 'invalid_item') return res.status(400).json({ error: 'invalid_item' })
    res.status(500).json({ error: 'server_error' })
  }
})

app.get('/cart/:userId', (req, res) => {
  const cart = getCart(req.params.userId)
  res.json({ cart })
})

app.post('/checkout/:userId', (req, res) => {
  try {
    const order = checkout(req.params.userId, req.body.discountCode)
    res.status(201).json({ order })
  } catch (e) {
    if (e.message === 'empty_cart') return res.status(400).json({ error: 'empty_cart' })
    if (e.message === 'invalid_discount') return res.status(400).json({ error: 'invalid_discount' })
    res.status(500).json({ error: 'server_error' })
  }
})

app.post('/admin/discounts/generate', (req, res) => {
  try {
    if (!canGenerateDiscount()) return res.status(400).json({ error: 'not_available' })
    const discount = generateDiscount()
    res.status(201).json({ discount })
  } catch (e) {
    if (e.message === 'cannot_generate') return res.status(400).json({ error: 'not_available' })
    res.status(500).json({ error: 'server_error' })
  }
})

app.get('/admin/stats', (req, res) => {
  res.json(stats())
})

app.post('/admin/reset', (req, res) => {
  reset()
  res.status(204).end()
})

module.exports = app
const { evaluateApplicant } = require('./rules')

app.post('/rules/evaluate', (req, res) => {
  try {
    const out = evaluateApplicant(req.body)
    res.json(out)
  } catch (e) {
    res.status(400).json({ error: 'bad_request' })
  }
})