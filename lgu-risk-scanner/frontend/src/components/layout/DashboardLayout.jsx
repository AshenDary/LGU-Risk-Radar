import Sidebar from './Sidebar'
import Topbar from './Topbar'

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#01111f] text-white">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />

        <main className="flex-1 bg-[#031827] p-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
