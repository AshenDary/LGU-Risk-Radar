import LGUSummaryCards from '../components/dashboard/LGUSummaryCards'
import TopTrustworthyLGUs from '../components/dashboard/TopTrustworthyLGUs'
import NCRScoreChart from '../components/dashboard/NCRScoreChart'
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
          <div className="flex w-full items-center justify-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 py-4 text-sm font-medium text-blue-600 transition-all duration-500">
            <div className="h-5 w-5 rounded-full border-2 border-blue-500/40 border-t-blue-600 animate-spin" />
            <span className="animate-pulse">Analyzing live LGU data...</span>
          </div>
        ) : (
          <>
            <LGUSummaryCards summaryData={summary} />

            <NCRScoreChart data={chartRows} />

            <TopTrustworthyLGUs data={trustworthyRows} />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
