import WhatIfSimulator from '../components/dashboard/WhatIfSimulator'
import DashboardLayout from '../components/layout/DashboardLayout'

function SimulatorPage() {
  return (
    <DashboardLayout
      title="What-If Simulator"
      description="Estimate risk score changes using adjustable input scenarios."
    >
      <div className="flex justify-center">
        <div className="w-full max-w-5xl">
          <WhatIfSimulator />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SimulatorPage
