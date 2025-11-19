const request = require('supertest')
const app = require('../src/app')

test('rules evaluate Employee approve path', async () => {
  const payload = { role: 'Employee', dob: '1990-01-01', heightCm: 180, weightKg: 60, address: { state: 'CA' } }
  const res = await request(app).post('/rules/evaluate').send(payload).expect(200)
  expect(res.body.productsShown).toEqual(['Alpha', 'Beta', 'Gamma'])
  expect(res.body.decision).toBe('approve')
  expect(res.body.genderOptions).toEqual(['Male', 'Female'])
})

test('rules evaluate Spouse decline by age', async () => {
  const payload = { role: 'Spouse', dob: '1940-01-01', heightCm: 170, weightKg: 60, address: { state: 'FL' } }
  const res = await request(app).post('/rules/evaluate').send(payload).expect(200)
  expect(res.body.productsShown).toEqual(['Delta', 'Epsilon'])
  expect(res.body.decision).toBe('decline')
  expect(res.body.genderOptions).toEqual(['Male', 'Female', 'Nonbinary'])
})