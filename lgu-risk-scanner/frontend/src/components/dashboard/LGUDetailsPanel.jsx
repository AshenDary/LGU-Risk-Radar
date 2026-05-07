import Card from '../ui/Card'
import ProgressBar from '../ui/ProgressBar'

function LGUDetailsPanel({ lgu }) {
  const selectedLgu = lgu || {
    name: 'No LGU selected',
    score: 0,
    factors: {},
  }

  const indicators = [
    {
      label: 'Procurement Volume',
      value: Number(selectedLgu.factors.procurement_volume_risk || 0),
      variant: 'warning',
    },
    {
      label: 'Supplier Concentration',
      value: Number(selectedLgu.factors.supplier_concentration_risk || 0),
      variant: 'danger',
    },
    {
      label: 'Status Anomalies',
      value: Number(selectedLgu.factors.status_anomaly_risk || 0),
      variant: 'warning',
    },
  ]

  return (
    <Card>
      <div className="mb-6">
        <p className="text-sm font-medium text-[#1E293B]/65">Selected LGU</p>
        <h2 className="mt-2 text-xl font-semibold text-[#0F172A]">{selectedLgu.name}</h2>
      </div>

      <div className="mb-8">
        <p className="text-sm font-medium text-[#1E293B]/65">Risk Score</p>
        <p className="mt-2 text-5xl font-semibold text-[#0F172A]">{selectedLgu.score.toFixed(2)}</p>
      </div>

      <div className="space-y-5">
        {indicators.map((indicator) => {
          const percentage = Math.round(indicator.value)

          return (
            <div key={indicator.label}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-[#1E293B]/80">{indicator.label}</p>
                <p className="text-sm text-[#1E293B]/65">{percentage}%</p>
              </div>
              <ProgressBar value={percentage} variant={indicator.variant} />
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default LGUDetailsPanel
