import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

const AnalysisPage = lazy(() => import('./pages/AnalysisPage'))
const AuditExplorerPage = lazy(() => import('./pages/AuditExplorerPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const LandingPage = lazy(() => import('./pages/LandingPage'))
const LGURankingPage = lazy(() => import('./pages/LGURankingPage'))

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#01111f] p-6 text-sm text-cyan-50/70">Loading...</div>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/lgu-ranking" element={<LGURankingPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/audit-explorer" element={<AuditExplorerPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
