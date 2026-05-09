import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import RiskOverview from '../components/analysis/RiskOverview'
import RiskFactors from '../components/analysis/RiskFactors'
import { useRiskData } from '../hooks/useRiskData'

function AnalysisPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const { loading, error, lguRiskRows, procurements } = useRiskData()

  const tabs = [
    { id: 'overview', label: 'Risk Overview' },
    { id: 'factors', label: 'Risk Factors' },
  ]

  return (
    <DashboardLayout
      title="Analysis"
      description="Deep dive into LGU risk metrics and contributing factors."
    >
      <div className="grid gap-8">
        {/* Tab Navigation */}
        <div className="-mt-4 flex justify-center gap-2 border-b border-[#38BDF8]/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-bold transition ${
                activeTab === tab.id
                  ? 'border-b-2 border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                  : 'text-[#1E293B]/60 hover:bg-[#F8FAFC] hover:text-[#2563EB]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

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
            {activeTab === 'overview' && <RiskOverview rows={lguRiskRows} procurements={procurements} />}
            {activeTab === 'factors' && <RiskFactors rows={lguRiskRows} />}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AnalysisPage
