import { useMemo, useState } from 'react'
import AiRiskExplainer from '../components/analysis/AiRiskExplainer'
import TopRiskTable from '../components/dashboard/TopRiskTable'
import InfoBanner from '../components/common/InfoBanner'
import PageHeader from '../components/common/PageHeader'
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
    <DashboardLayout>
      <div className="grid gap-6">
        <PageHeader
          title="LGU Ranking"
          description="Ranked LGUs based on current risk scores."
        />

        <InfoBanner text="This section ranks local government units based on their computed risk scores. Higher scores indicate greater likelihood of irregularities or inefficiencies, helping prioritize areas for audit and investigation." />

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-cyan-200/10 bg-[#0f2e47] p-6 text-sm text-cyan-50/70">
            Loading live backend data...
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <TopRiskTable rows={topRiskRows} selectedId={selectedLgu?.id} onSelect={(row) => setSelectedId(row.id)} />
            <AiRiskExplainer item={selectedLgu} />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default LGURankingPage
