import PhilippinesMap from '../components/dashboard/PhilippinesMap'
import DashboardLayout from '../components/layout/DashboardLayout'

function MapViewPage() {
  return (
    <DashboardLayout
      title="Map View"
      description="Geographic risk patterns across Philippine LGUs."
    >
      <div className="grid gap-8">
        <PhilippinesMap />
      </div>
    </DashboardLayout>
  )
}

export default MapViewPage
