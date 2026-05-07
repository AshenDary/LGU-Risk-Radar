import { useMemo, useState } from 'react'
import Card from '../ui/Card'

const sliderConfig = [
  {
    key: 'singleBidRate',
    label: 'Single Bid Rate',
  },
  {
    key: 'repeatFindings',
    label: 'Repeat Findings',
  },
  {
    key: 'supplierConcentration',
    label: 'Supplier Concentration',
  },
]

function WhatIfSimulator() {
  const [values, setValues] = useState({
    singleBidRate: 0.5,
    repeatFindings: 0.5,
    supplierConcentration: 0.5,
  })

  const newRiskScore = useMemo(() => {
    return Math.round(
      (values.singleBidRate + values.repeatFindings + values.supplierConcentration) * 33,
    )
  }, [values])

  function handleSliderChange(key, value) {
    setValues((currentValues) => ({
      ...currentValues,
      [key]: Number(value),
    }))
  }

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-[#0F172A]">What-If Simulator</h2>
        <p className="mt-1 text-sm text-[#1E293B]/65">Adjust indicators to estimate a new risk score</p>
      </div>

      <div className="mb-8 rounded-xl border border-[#38BDF8]/30 bg-[#F8FAFC] p-5">
        <p className="text-sm font-medium text-[#1E293B]/65">New Risk Score</p>
        <p className="mt-2 text-5xl font-bold tracking-tight text-[#0F172A]">{newRiskScore}</p>
      </div>

      <div className="space-y-6">
        {sliderConfig.map((item) => (
          <label key={item.key} className="block">
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-[#1E293B]/80">{item.label}</span>
              <span className="text-sm text-[#1E293B]/65">
                {Math.round(values[item.key] * 100)}%
              </span>
            </div>
            <input
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#2563EB]"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={values[item.key]}
              onChange={(event) => handleSliderChange(item.key, event.target.value)}
            />
          </label>
        ))}
      </div>
    </Card>
  )
}

export default WhatIfSimulator
