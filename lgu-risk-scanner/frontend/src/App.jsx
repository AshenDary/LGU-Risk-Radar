import { Navigate, Route, Routes } from 'react-router-dom'
import AboutPage from './pages/AboutPage'
import AnalysisPage from './pages/AnalysisPage'
import AuditExplorerPage from './pages/AuditExplorerPage'
import DashboardPage from './pages/DashboardPage'
import LGURankingPage from './pages/LGURankingPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/lgu-ranking" element={<LGURankingPage />} />
      <Route path="/analysis" element={<AnalysisPage />} />
      <Route path="/audit-explorer" element={<AuditExplorerPage />} />
    </Routes>
  )
}

export default App
