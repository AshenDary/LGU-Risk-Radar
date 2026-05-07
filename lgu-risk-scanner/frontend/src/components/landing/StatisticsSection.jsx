const stats = [
  { icon: '🏙️', value: '1,634', label: 'LGUs Monitored' },
  { icon: '⚠️', value: '312', label: 'High-Risk LGUs' },
  { icon: '📈', value: '54.7', label: 'Avg Risk Score' },
  { icon: '🚨', value: '78', label: 'Critical Alerts' },
]

export default function StatisticsSection() {
  return (
    <section className="flex min-h-screen items-center py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-4 shadow-xl shadow-[#0F172A]/5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-white to-[#F8FAFC] p-6 text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-white text-3xl shadow-sm ring-1 ring-[#E2E8F0]">
                  {stat.icon}
                </div>
                <p className="text-4xl font-black tracking-tight text-[#0F172A]">{stat.value}</p>
                <p className="mt-2 text-sm font-bold text-[#1E293B]/75">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
