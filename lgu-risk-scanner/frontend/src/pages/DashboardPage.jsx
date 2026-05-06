import LGUSummaryCards from '../components/dashboard/LGUSummaryCards'
import TopTrustworthyLGUs from '../components/dashboard/TopTrustworthyLGUs'
import NCRScoreChart from '../components/dashboard/NCRScoreChart'
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

        <InfoBanner text="This dashboard provides an overall view of LGU risk levels based on computed indicators such as procurement anomalies, audit findings, and supplier behavior. The charts summarize current risk distribution and trustworthiness trends across the NCR." />

        <LGUSummaryCards />

        <NCRScoreChart />

        <TopTrustworthyLGUs />
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
