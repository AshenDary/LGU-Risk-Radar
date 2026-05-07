import SolidIcon from './SolidIcon'

const stats = [
  { icon: 'map', value: '1,634', label: 'LGUs Monitored' },
  { icon: 'shield', value: '312', label: 'High-Risk LGUs' },
  { icon: 'chart', value: '54.7', label: 'Avg Risk Score' },
  { icon: 'search', value: '78', label: 'Critical Alerts' },
]

export default function StatisticsSection() {
  return (
    <section className="flex min-h-screen items-center py-14 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-xl shadow-[#0F172A]/5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-[#E2E8F0] bg-gradient-to-br from-white to-[#F8FAFC] p-5 text-center sm:p-6">
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-lg bg-[#2563EB] text-white shadow-sm">
                  <SolidIcon name={stat.icon} className="h-6 w-6" />
                </div>
                <p className="text-3xl font-black tracking-tight text-[#0F172A] sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-sm font-bold text-[#1E293B]/75">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
