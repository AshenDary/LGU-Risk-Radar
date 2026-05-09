import WhatIfSimulator from '../components/dashboard/WhatIfSimulator'
import DashboardLayout from '../components/layout/DashboardLayout'

function SimulatorPage() {
  return (
    <DashboardLayout
      title="What-If Simulator"
      description="Estimate risk score changes using adjustable input scenarios."
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <WhatIfSimulator />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SimulatorPage
