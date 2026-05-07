import { useEffect, useMemo, useState } from 'react'
import Card from '../ui/Card'
import { fetchLGUs, fetchRiskByLGU, simulateRisk } from '../../services/api'

const sliderConfig = [
  {
    key: 'procurementCount',
    label: 'Number of Procurements',
    min: 1,
    max: 100,
    default: 20,
    step: 1,
  },
  {
    key: 'avgAmount',
    label: 'Average Procurement Amount (₱)',
    min: 10000,
    max: 10000000,
    default: 500000,
    step: 10000,
  },
  {
    key: 'supplierDiversity',
    label: 'Supplier Diversity (0-100%)',
    min: 0,
    max: 100,
    default: 50,
    step: 1,
  },
  {
    key: 'completionRate',
    label: 'Procurement Completion Rate (0-100%)',
    min: 0,
    max: 100,
    default: 80,
    step: 1,
  },
]

function WhatIfSimulator() {
  const [lgus, setLgus] = useState([])
  const [selectedLguId, setSelectedLguId] = useState('')
  const [currentRiskData, setCurrentRiskData] = useState(null)
  const [simulationResult, setSimulationResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [values, setValues] = useState({
    procurementCount: 20,
    avgAmount: 500000,
    supplierDiversity: 50,
    completionRate: 80,
  })

  useEffect(() => {
    setError('')
    fetchLGUs()
      .then(setLgus)
      .catch((err) => setError(`Failed to load LGUs: ${err.message}`))
  }, [])

  useEffect(() => {
    if (!selectedLguId) {
      setCurrentRiskData(null)
      setSimulationResult(null)
      return
    }

    setError('')
    setLoading(true)
    fetchRiskByLGU(selectedLguId)
      .then((data) => {
        setCurrentRiskData(data)
        setSimulationResult(null)
      })
      .catch((err) => setError(`Failed to load risk data: ${err.message}`))
      .finally(() => setLoading(false))
  }, [selectedLguId])

  const hypotheticalProcurements = useMemo(() => {
    const procurements = []
    const { procurementCount, avgAmount, supplierDiversity, completionRate } = values

    for (let index = 0; index < procurementCount; index += 1) {
      const amountVariation = (Math.random() - 0.5) * 0.5
      const amount = Math.max(1000, avgAmount * (1 + amountVariation))
      const isDiverse = Math.random() * 100 < supplierDiversity
      const isCompleted = Math.random() * 100 < completionRate

      procurements.push({
        amount: Math.round(amount),
        supplier: isDiverse ? `Supplier ${index + 1}` : 'Primary Supplier',
        status: isCompleted ? 'completed' : 'draft',
        title: `Procurement ${index + 1}`,
      })
    }

    return procurements
  }, [values])

  useEffect(() => {
    if (!selectedLguId || !currentRiskData) return

    setError('')
    setLoading(true)
    simulateRisk(selectedLguId, hypotheticalProcurements)
      .then(setSimulationResult)
      .catch((err) => setError(`Simulation failed: ${err.message}`))
      .finally(() => setLoading(false))
  }, [selectedLguId, hypotheticalProcurements, currentRiskData])

  function handleSliderChange(key, value) {
    setValues((currentValues) => ({
      ...currentValues,
      [key]: Number(value),
    }))
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  function formatSliderValue(key) {
    if (key === 'avgAmount') return formatCurrency(values[key])
    if (key.includes('Rate') || key === 'supplierDiversity') return `${values[key]}%`
    return values[key]
  }

  const currentScore = currentRiskData?.risk_score?.score ?? '—'
  const currentLevel = currentRiskData?.risk_score?.risk_level
  const simulatedScore = simulationResult?.score ?? '—'
  const simulatedLevel = simulationResult?.risk_level

  return (
    <Card>
      <div className="mb-7">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Simulation</p>
        <h2 className="mt-2 text-3xl font-black leading-tight text-[#0F172A]">What-If Simulator</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-[#475569]">
          Adjust procurement parameters to estimate a new risk score.
        </p>
      </div>

      <div className="mb-6">
        <label htmlFor="simulator-lgu" className="mb-2 block text-sm font-semibold text-[#0F172A]">
          Select LGU to simulate
        </label>
        <select
          id="simulator-lgu"
          value={selectedLguId}
          onChange={(event) => setSelectedLguId(event.target.value)}
          className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#0F172A] shadow-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#DBEAFE]"
        >
          <option value="">Choose an LGU...</option>
          {lgus.map((lgu) => (
            <option key={lgu.id} value={lgu.id}>
              {lgu.name}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!selectedLguId && !error ? (
        <div className="mb-6 rounded-2xl border border-[#38BDF8]/25 bg-[#EFF6FF] px-4 py-3 text-sm text-[#1D4ED8]">
          Choose an LGU to load its current score and run a simulation.
        </div>
      ) : null}

      {loading ? (
        <div className="mb-6 rounded-2xl border border-[#38BDF8]/25 bg-[#F8FAFC] px-4 py-3 text-sm text-[#475569]">
          Running simulation...
        </div>
      ) : null}

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#38BDF8]/25 bg-[#F8FAFC] p-5">
          <p className="text-sm font-semibold text-[#475569]">Current Risk Score</p>
          <p className="mt-2 text-4xl font-black tracking-tight text-[#0F172A]">{currentScore}</p>
          <p className="mt-2 text-sm font-medium text-[#2563EB]">
            {currentLevel ? `${currentLevel} Risk` : 'Waiting for baseline data'}
          </p>
        </div>

        <div className="rounded-2xl border border-[#38BDF8]/25 bg-[#EFF6FF] p-5">
          <p className="text-sm font-semibold text-[#475569]">Simulated Risk Score</p>
          <p className="mt-2 text-4xl font-black tracking-tight text-[#0F172A]">{simulatedScore}</p>
          <p className="mt-2 text-sm font-medium text-[#2563EB]">
            {simulatedLevel ? `${simulatedLevel} Risk` : 'Adjust the sliders to generate a projection'}
          </p>
        </div>
      </div>

      {simulationResult?.explanation ? (
        <div className="mb-8 rounded-2xl border border-[#38BDF8]/20 bg-white p-5 shadow-sm shadow-slate-200/70">
          <p className="text-sm font-semibold text-[#0F172A]">AI Analysis</p>
          <p className="mt-3 text-sm leading-6 text-[#475569]">{simulationResult.explanation}</p>
        </div>
      ) : null}

      <div className="space-y-6">
        {sliderConfig.map((item) => (
          <label key={item.key} className="block">
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-[#0F172A]">{item.label}</span>
              <span className="text-sm font-bold text-[#2563EB]">{formatSliderValue(item.key)}</span>
            </div>
            <input
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#2563EB]"
              type="range"
              min={item.min}
              max={item.max}
              step={item.step}
              value={values[item.key]}
              onChange={(event) => handleSliderChange(item.key, event.target.value)}
            />
          </label>
        ))}
      </div>

      {simulationResult ? (
        <div className="mt-6 border-t border-slate-200 pt-6 text-xs leading-5 text-[#64748B]">
          Simulation based on {values.procurementCount} procurements averaging {formatCurrency(values.avgAmount)},
          with {values.supplierDiversity}% supplier diversity and a {values.completionRate}% completion rate.
        </div>
      ) : null}
    </Card>
  )
}

export default WhatIfSimulator
