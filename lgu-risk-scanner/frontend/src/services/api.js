const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8000')

async function requestJson(path, options){
  const res = await fetch(`${API_BASE}${path}`, options)
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`API ${res.status} ${res.statusText}: ${detail}`)
  }
  return res.json()
}

export async function fetchLGUs(){
  return requestJson('/lgu/list')
}

export async function computeScore(lgu){
  return requestJson('/scoring/compute', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(lgu)
  })
}

export async function fetchRiskByLGU(lguId){
  return requestJson(`/scoring/by-lgu/${lguId}`)
}

export async function fetchProcurements(){
  return requestJson('/procurements/list')
}

export async function fetchRiskScores(){
  return requestJson('/scoring/list')
}

export async function fetchAudits(){
  return requestJson('/audit/list')
}

export async function simulateRisk(lguId, procurements){
  return requestJson('/scoring/simulate', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      lgu_id: lguId,
      procurements: procurements
    })
  })
}

export async function generateExplanation(lguName, riskScore, riskLevel, factors = {}){
  return requestJson('/explain/reason', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      lgu_name: lguName,
      risk_score: riskScore,
      risk_level: riskLevel,
      factors: factors
    })
  })
}

export async function askExplanationQuestion(lguName, riskScore, riskLevel, factors = {}, question){
  return requestJson('/explain/ask', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      lgu_name: lguName,
      risk_score: riskScore,
      risk_level: riskLevel,
      factors: factors,
      question: question
    })
  })
}

export async function generateAuditChecklist(profile){
  return requestJson('/explain/checklist', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ profile })
  })
}

export async function compareLGUProfiles(left, right){
  return requestJson('/explain/compare', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ left, right })
  })
}

export async function generateRiskReport(title, profiles, notes = ''){
  return requestJson('/explain/report', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ title, profiles, notes })
  })
}
