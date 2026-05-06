import WhatIfSimulator from '../components/dashboard/WhatIfSimulator'
import InfoBanner from '../components/common/InfoBanner'
import PageHeader from '../components/common/PageHeader'
import DashboardLayout from '../components/layout/DashboardLayout'

function SimulatorPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <PageHeader
          title="What-If Simulator"
          description="Estimate risk score changes using adjustable input scenarios."
        />

        <InfoBanner text="The simulator allows users to adjust key risk factors such as single bidding and supplier concentration. It demonstrates how changes in these variables impact the overall risk score." />

        <div className="max-w-2xl">
          <WhatIfSimulator />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SimulatorPage
