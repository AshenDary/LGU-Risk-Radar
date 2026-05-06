import InfoBanner from '../components/common/InfoBanner'
import PageHeader from '../components/common/PageHeader'
import DashboardLayout from '../components/layout/DashboardLayout'

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <PageHeader title="Reports" description="Generate and export audit reports." />

        <InfoBanner text="This page enables generation of structured reports summarizing LGU risk assessments, trends, and audit findings. These reports can be used for documentation and decision-making." />
      </div>
    </DashboardLayout>
  )
}
