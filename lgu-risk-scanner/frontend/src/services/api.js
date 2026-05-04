const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function fetchLGUs(){
  const res = await fetch(`${API_BASE}/lgu/list`)
  return res.json()
}

export async function computeScore(lgu){
  const res = await fetch(`${API_BASE}/scoring/compute`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(lgu)
  })
  return res.json()
}

export async function fetchProcurements(){
  const res = await fetch(`${API_BASE}/procurements/list`)
  return res.json()
}

export async function fetchRiskScores(){
  const res = await fetch(`${API_BASE}/scoring/list`)
  return res.json()
}

export async function fetchAudits(){
  const res = await fetch(`${API_BASE}/audit/list`)
  return res.json()
}
