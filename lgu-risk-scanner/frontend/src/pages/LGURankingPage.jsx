import TopRiskTable from '../components/dashboard/TopRiskTable'
import InfoBanner from '../components/common/InfoBanner'
import PageHeader from '../components/common/PageHeader'
import DashboardLayout from '../components/layout/DashboardLayout'

function LGURankingPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <PageHeader
          title="LGU Ranking"
          description="Ranked LGUs based on current risk scores."
        />

        <InfoBanner text="This section ranks local government units based on their computed risk scores. Higher scores indicate greater likelihood of irregularities or inefficiencies, helping prioritize areas for audit and investigation." />

        <TopRiskTable />
      </div>
    </DashboardLayout>
  )
}

export default LGURankingPage
