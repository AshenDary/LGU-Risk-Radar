import { Navigate, Route, Routes } from 'react-router-dom'
import AboutPage from './pages/AboutPage'
import AuditExplorerPage from './pages/AuditExplorerPage'
import CompareLGUsPage from './pages/CompareLGUsPage'
import DashboardPage from './pages/DashboardPage'
import LGURankingPage from './pages/LGURankingPage'
import MapViewPage from './pages/MapViewPage'
import ReportsPage from './pages/ReportsPage'
import SimulatorPage from './pages/SimulatorPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/lgu-ranking" element={<LGURankingPage />} />
      <Route path="/map-view" element={<MapViewPage />} />
      <Route path="/compare-lgus" element={<CompareLGUsPage />} />
      <Route path="/simulator" element={<SimulatorPage />} />
      <Route path="/audit-explorer" element={<AuditExplorerPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  )
}

export default App
