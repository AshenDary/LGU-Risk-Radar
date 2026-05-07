import LGUSummaryCards from '../components/dashboard/LGUSummaryCards'
import TopTrustworthyLGUs from '../components/dashboard/TopTrustworthyLGUs'
import NCRScoreChart from '../components/dashboard/NCRScoreChart'
import InfoBanner from '../components/common/InfoBanner'
import PageHeader from '../components/common/PageHeader'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useRiskData } from '../hooks/useRiskData'

function DashboardPage() {
  const { loading, error, summary, chartRows, trustworthyRows } = useRiskData()

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <PageHeader
          title="Dashboard"
          description="Monitor nationwide LGU risk levels through summary metrics and visual trends."
        />

        <InfoBanner text="This dashboard provides an overall view of LGU risk levels based on computed indicators such as procurement anomalies, audit findings, and supplier behavior. The charts summarize current risk distribution and trustworthiness trends across the NCR." />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-[#1E293B]/70 shadow-sm">
            Loading live backend data...
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
