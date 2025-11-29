const express = require('express')
const path = require('path')
const cors = require('cors')
const { addToCart, getCart, removeFromCart, updateCartItem, checkout, canGenerateDiscount, generateDiscount, stats, reset } = require('./store')

const app = express()

app.use(cors())

app.use(express.json())

app.use(express.static(path.join(__dirname, '../public')))

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

app.delete('/cart/:userId/items/:itemId', (req, res) => {
  try {
    const cart = removeFromCart(req.params.userId, req.params.itemId)
    res.json({ cart })
  } catch (e) {
    if (e.message === 'item_not_found') return res.status(404).json({ error: 'item_not_found' })
    res.status(500).json({ error: 'server_error' })
  }
})

app.patch('/cart/:userId/items/:itemId', (req, res) => {
  try {
    const cart = updateCartItem(req.params.userId, req.params.itemId, req.body)
    res.json({ cart })
  } catch (e) {
    if (e.message === 'item_not_found') return res.status(404).json({ error: 'item_not_found' })
    if (e.message === 'invalid_quantity') return res.status(400).json({ error: 'invalid_quantity' })
    res.status(500).json({ error: 'server_error' })
  }
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
    if (!canGenerateDiscount(true)) return res.status(400).json({ error: 'not_available' })
    const discount = generateDiscount(true)
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