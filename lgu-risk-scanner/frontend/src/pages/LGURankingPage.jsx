import { useMemo, useState } from 'react'
import AiRiskExplainer from '../components/analysis/AiRiskExplainer'
import TopRiskTable from '../components/dashboard/TopRiskTable'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useRiskData } from '../hooks/useRiskData'

function LGURankingPage() {
  const [selectedId, setSelectedId] = useState('')
  const { loading, error, topRiskRows } = useRiskData()
  const selectedLgu = useMemo(
    () => topRiskRows.find((row) => row.id === selectedId) || topRiskRows[0],
    [selectedId, topRiskRows]
  )

  return (
    <DashboardLayout
      title="LGU Ranking"
      description="Ranked LGUs based on current risk scores."
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
          <div className="grid min-w-0 gap-8">
            <TopRiskTable rows={topRiskRows} selectedId={selectedLgu?.id} onSelect={(row) => setSelectedId(row.id)} />
            <AiRiskExplainer item={selectedLgu} />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default LGURankingPage
