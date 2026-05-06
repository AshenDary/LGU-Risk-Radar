import LGUSummaryCards from '../components/dashboard/LGUSummaryCards'
import RiskDistributionChart from '../components/dashboard/RiskDistributionChart'
import RiskTrendChart from '../components/dashboard/RiskTrendChart'
import InfoBanner from '../components/common/InfoBanner'
import PageHeader from '../components/common/PageHeader'
import DashboardLayout from '../components/layout/DashboardLayout'

function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <PageHeader
          title="Dashboard"
          description="Monitor nationwide LGU risk levels through summary metrics and visual trends."
        />

        <InfoBanner text="This dashboard provides an overall view of LGU risk levels based on computed indicators such as procurement anomalies, audit findings, and supplier behavior. The charts summarize trends and distributions to help identify nationwide patterns." />

        <LGUSummaryCards />

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RiskTrendChart />
          </div>
          <RiskDistributionChart />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
