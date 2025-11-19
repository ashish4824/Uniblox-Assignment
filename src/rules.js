function ageFromDob(dob) {
  const d = new Date(dob)
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  const m = now.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--
  return age
}

function bmi(heightCm, weightKg) {
  const h = heightCm / 100
  return weightKg / (h * h)
}

const specialStates = new Set(['NJ', 'FL', 'WA', 'KS', 'NY'])

function evaluateApplicant(applicant) {
  const role = applicant.role
  const productsShown = role === 'Employee' ? ['Alpha', 'Beta', 'Gamma'] : role === 'Spouse' ? ['Delta', 'Epsilon'] : []
  const age = applicant.dob ? ageFromDob(applicant.dob) : applicant.age
  let decision = 'pending'
  if (role === 'Employee' && age > 80) decision = 'decline'
  else if (role === 'Spouse' && age > 70) decision = 'decline'
  else {
    const valBmi = bmi(applicant.heightCm, applicant.weightKg)
    decision = valBmi > 20 ? 'decline' : 'approve'
  }
  const state = applicant.address?.state
  const genderOptions = specialStates.has(state) ? ['Male', 'Female', 'Nonbinary'] : ['Male', 'Female']
  return { productsShown, decision, genderOptions, age }
}

module.exports = { evaluateApplicant }