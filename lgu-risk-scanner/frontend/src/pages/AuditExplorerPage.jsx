import InfoBanner from '../components/common/InfoBanner'
import PageHeader from '../components/common/PageHeader'
import DashboardLayout from '../components/layout/DashboardLayout'

function AuditExplorerPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <PageHeader
          title="Audit Explorer"
          description="Explore audit findings and related LGU risk indicators."
        />

        <InfoBanner text="This section provides detailed audit findings for each LGU, including repeated issues, anomalies, and compliance gaps. It supports deeper investigation into the causes of high risk scores." />
      </div>
    </DashboardLayout>
  )
}

export default AuditExplorerPage
