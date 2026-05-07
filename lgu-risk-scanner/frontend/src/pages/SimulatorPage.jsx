import WhatIfSimulator from '../components/dashboard/WhatIfSimulator'
import DashboardLayout from '../components/layout/DashboardLayout'

function SimulatorPage() {
  return (
    <DashboardLayout
      title="What-If Simulator"
      description="Estimate risk score changes using adjustable input scenarios."
    >
      <div className="grid gap-8">
        <div className="max-w-3xl">
          <WhatIfSimulator />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SimulatorPage
