import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import DashboardLayout from '../components/layout/DashboardLayout'
import RiskOverview from '../components/analysis/RiskOverview'
import RiskFactors from '../components/analysis/RiskFactors'

function AnalysisPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Risk Overview' },
    { id: 'factors', label: 'Risk Factors' },
  ]

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <PageHeader
          title="Analysis"
          description="Deep dive into LGU risk metrics and contributing factors."
        />

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-cyan-200/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-cyan-100/60 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <RiskOverview />}
        {activeTab === 'factors' && <RiskFactors />}
      </div>
    </DashboardLayout>
  )
}

export default AnalysisPage
