import InfoBanner from '../components/common/InfoBanner'
import PageHeader from '../components/common/PageHeader'
import DashboardLayout from '../components/layout/DashboardLayout'

function AboutPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <PageHeader
          title="About"
          description="Learn about the purpose, methodology, and data sources of Bantay Bayan."
        />

        <InfoBanner text="Bantay Bayan is an AI-powered system designed to analyze and monitor risks in local government units. It uses data-driven insights to support transparency, accountability, and better governance." />
      </div>
    </DashboardLayout>
  )
}

export default AboutPage
