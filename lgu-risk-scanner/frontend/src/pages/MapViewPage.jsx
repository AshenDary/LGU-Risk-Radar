import PhilippinesMap from '../components/dashboard/PhilippinesMap'
import InfoBanner from '../components/common/InfoBanner'
import PageHeader from '../components/common/PageHeader'
import DashboardLayout from '../components/layout/DashboardLayout'

function MapViewPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <PageHeader
          title="Map View"
          description="Geographic risk patterns across Philippine LGUs."
        />

        <InfoBanner text="This map visualizes the geographic distribution of risk across LGUs in the Philippines. Color intensity reflects the severity of risk, allowing quick identification of high-risk regions." />

        <PhilippinesMap />
      </div>
    </DashboardLayout>
  )
}

export default MapViewPage
