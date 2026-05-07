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

  // Load LGUs on mount
  useEffect(() => {
    fetchLGUs()
      .then(setLgus)
      .catch(err => setError('Failed to load LGUs: ' + err.message))
  }, [])

  // Load current risk data when LGU is selected
  useEffect(() => {
    if (!selectedLguId) {
      setCurrentRiskData(null)
      setSimulationResult(null)
      return
    }

    setLoading(true)
    fetchRiskByLGU(selectedLguId)
      .then(data => {
        setCurrentRiskData(data)
        setSimulationResult(null) // Reset simulation when LGU changes
      })
      .catch(err => setError('Failed to load risk data: ' + err.message))
      .finally(() => setLoading(false))
  }, [selectedLguId])

  // Generate hypothetical procurements based on slider values
  const hypotheticalProcurements = useMemo(() => {
    const procurements = []
    const { procurementCount, avgAmount, supplierDiversity, completionRate } = values

    for (let i = 0; i < procurementCount; i++) {
      // Vary amounts around the average
      const amountVariation = (Math.random() - 0.5) * 0.5 // ±25% variation
      const amount = Math.max(1000, avgAmount * (1 + amountVariation))

      // Generate suppliers based on diversity
      const isDiverse = Math.random() * 100 < supplierDiversity
      const supplier = isDiverse ? `Supplier ${i + 1}` : 'Primary Supplier'

      // Set status based on completion rate
      const isCompleted = Math.random() * 100 < completionRate
      const status = isCompleted ? 'completed' : 'draft'

      procurements.push({
        amount: Math.round(amount),
        supplier,
        status,
        title: `Procurement ${i + 1}`
      })
    }

    return procurements
  }, [values])

  // Run simulation when values change
  useEffect(() => {
    if (!selectedLguId || !currentRiskData) return

    setLoading(true)
    simulateRisk(selectedLguId, hypotheticalProcurements)
      .then(setSimulationResult)
      .catch(err => setError('Simulation failed: ' + err.message))
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

  return (
    <Card>
      <div className="mb-6">
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> db5e2d12830466d8905a56e2365ea7767f9cfcdc
        <h2 className="text-base font-semibold text-white">What-If Simulator</h2>
        <p className="mt-1 text-sm text-cyan-50/60">Adjust procurement parameters to see how they affect risk scores</p>
      </div>

      {/* LGU Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-cyan-50/75 mb-2">
          Select LGU to Simulate
        </label>
        <select
          value={selectedLguId}
          onChange={(e) => setSelectedLguId(e.target.value)}
          className="w-full px-3 py-2 bg-cyan-950/50 border border-cyan-700/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">Choose an LGU...</option>
          {lgus.map((lgu) => (
            <option key={lgu.id} value={lgu.id}>
              {lgu.name}
            </option>
          ))}
        </select>
<<<<<<< HEAD
=======
        <h2 className="text-base font-semibold text-[#0F172A]">What-If Simulator</h2>
        <p className="mt-1 text-sm text-[#1E293B]/65">Adjust indicators to estimate a new risk score</p>
      </div>

      <div className="mb-8 rounded-xl border border-[#38BDF8]/30 bg-[#F8FAFC] p-5">
        <p className="text-sm font-medium text-[#1E293B]/65">New Risk Score</p>
        <p className="mt-2 text-5xl font-bold tracking-tight text-[#0F172A]">{newRiskScore}</p>
>>>>>>> 2061fb395cf2764af7e7bc9d8efdf4e7b4017f8a
=======
>>>>>>> db5e2d12830466d8905a56e2365ea7767f9cfcdc
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-6 rounded-lg border border-cyan-200/10 bg-[#0f2e47] p-6 text-sm text-cyan-50/70">
          Running simulation...
        </div>
      )}

      {currentRiskData && simulationResult && (
        <div className="mb-8 grid grid-cols-2 gap-4">
          {/* Current Risk */}
          <div className="rounded-xl border border-cyan-200/10 bg-[#01111f]/70 p-5">
            <p className="text-sm font-medium text-cyan-50/60 mb-2">Current Risk Score</p>
            <p className="text-3xl font-bold tracking-tight text-white mb-1">
              {currentRiskData.risk_score.score}
            </p>
            <p className="text-sm text-cyan-300">
              {currentRiskData.risk_score.risk_level} Risk
            </p>
          </div>

          {/* Simulated Risk */}
          <div className="rounded-xl border border-cyan-200/10 bg-[#01111f]/70 p-5">
            <p className="text-sm font-medium text-cyan-50/60 mb-2">Simulated Risk Score</p>
            <p className="text-3xl font-bold tracking-tight text-white mb-1">
              {simulationResult.score}
            </p>
            <p className="text-sm text-cyan-300">
              {simulationResult.risk_level} Risk
            </p>
          </div>
        </div>
      )}

      {/* AI Explanation */}
      {simulationResult && (
        <div className="mb-8 rounded-xl border border-cyan-200/10 bg-[#01111f]/70 p-5">
          <p className="text-sm font-medium text-cyan-50/60 mb-3">AI Analysis</p>
          <p className="text-sm text-cyan-50/80 leading-relaxed">
            {simulationResult.explanation}
          </p>
        </div>
      )}

      {/* Sliders */}
      <div className="space-y-6">
        {sliderConfig.map((item) => (
          <label key={item.key} className="block">
            <div className="mb-3 flex items-center justify-between gap-4">
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> db5e2d12830466d8905a56e2365ea7767f9cfcdc
              <span className="text-sm font-medium text-cyan-50/75">{item.label}</span>
              <span className="text-sm text-cyan-50/60">
                {item.key === 'avgAmount' 
                  ? formatCurrency(values[item.key])
                  : item.key.includes('Rate') || item.key === 'supplierDiversity' || item.key === 'completionRate'
                  ? `${values[item.key]}%`
                  : values[item.key]
                }
<<<<<<< HEAD
=======
              <span className="text-sm font-medium text-[#1E293B]/80">{item.label}</span>
              <span className="text-sm text-[#1E293B]/65">
                {Math.round(values[item.key] * 100)}%
>>>>>>> 2061fb395cf2764af7e7bc9d8efdf4e7b4017f8a
=======
>>>>>>> db5e2d12830466d8905a56e2365ea7767f9cfcdc
              </span>
            </div>
            <input
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-cyan-950 accent-cyan-300"
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

      {/* Summary */}
      {simulationResult && (
        <div className="mt-6 pt-6 border-t border-cyan-700/30">
          <p className="text-xs text-cyan-50/50">
            Simulation based on {values.procurementCount} procurements with average {formatCurrency(values.avgAmount)} each, 
            {values.supplierDiversity}% supplier diversity, and {values.completionRate}% completion rate.
          </p>
        </div>
      )}
    </Card>
  )
}

export default WhatIfSimulator
