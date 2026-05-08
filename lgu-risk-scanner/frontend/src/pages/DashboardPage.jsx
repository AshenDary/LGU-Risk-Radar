import LGUSummaryCards from '../components/dashboard/LGUSummaryCards'
import TopTrustworthyLGUs from '../components/dashboard/TopTrustworthyLGUs'
import NCRScoreChart from '../components/dashboard/NCRScoreChart'
import PhilippinesMap from '../components/dashboard/PhilippinesMap'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useRiskData } from '../hooks/useRiskData'

function DashboardPage() {
  const { loading, error, summary, chartRows, trustworthyRows } = useRiskData()

  return (
    <DashboardLayout
      title="Dashboard"
      description="Monitor nationwide LGU risk levels through summary metrics and visual trends."
    >
      <div className="grid gap-8">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="premium-card reveal-on-scroll rounded-lg p-8 text-sm text-[#1E293B]/70">
            Loading live backend data...
          </div>
        ) : (
          <>
            <LGUSummaryCards summaryData={summary} />

            <NCRScoreChart data={chartRows} />

            <PhilippinesMap />

            <TopTrustworthyLGUs data={trustworthyRows} />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
