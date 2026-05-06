import { lguDetails } from '../../data/mockData'
import Card from '../ui/Card'
import ProgressBar from '../ui/ProgressBar'

const indicators = [
  {
    label: 'Single Bid Rate',
    value: lguDetails.factors.singleBidRate,
    variant: 'danger',
  },
  {
    label: 'Repeat Findings',
    value: lguDetails.factors.repeatFindings,
    variant: 'warning',
  },
  {
    label: 'Supplier Concentration',
    value: lguDetails.factors.supplierConcentration,
    variant: 'warning',
  },
]

function LGUDetailsPanel() {
  return (
    <Card>
      <div className="mb-6">
        <p className="text-sm font-medium text-cyan-50/60">Selected LGU</p>
        <h2 className="mt-2 text-xl font-semibold text-white">{lguDetails.name}</h2>
      </div>

      <div className="mb-8">
        <p className="text-sm font-medium text-cyan-50/60">Risk Score</p>
        <p className="mt-2 text-5xl font-semibold text-white">{lguDetails.riskScore}</p>
      </div>

      <div className="space-y-5">
        {indicators.map((indicator) => {
          const percentage = Math.round(indicator.value * 100)

          return (
            <div key={indicator.label}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-cyan-50/75">{indicator.label}</p>
                <p className="text-sm text-cyan-50/60">{percentage}%</p>
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
