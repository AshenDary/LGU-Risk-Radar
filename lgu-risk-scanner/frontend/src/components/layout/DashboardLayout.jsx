import Sidebar from './Sidebar'
import Topbar from './Topbar'

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#01111f] text-white">
      <Sidebar />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="min-w-0 flex-1 bg-[#031827] p-4 sm:p-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
