import InfoBanner from '../components/common/InfoBanner'
import PageHeader from '../components/common/PageHeader'
import DashboardLayout from '../components/layout/DashboardLayout'

function CompareLGUsPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <PageHeader
          title="Compare LGUs"
          description="Compare LGUs across risk scores and procurement indicators."
        />

        <InfoBanner text="This feature allows comparison of multiple LGUs based on their risk indicators. It helps highlight differences in performance, procurement behavior, and audit outcomes." />
      </div>
    </DashboardLayout>
  )
}

export default CompareLGUsPage
