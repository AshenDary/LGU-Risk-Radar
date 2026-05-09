import { Link } from 'react-router-dom'
import { getRiskBadgeClass } from '../../utils/riskLevels'

function DashboardPreview() {
  const bars = [58, 74, 46, 88, 63, 92, 41, 77]

  return (
    <div className="reveal-on-scroll relative mx-auto w-full max-w-2xl animate-[fadeIn_0.8s_ease-out]">
      <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-[#38BDF8]/25 via-white to-[#2563EB]/10 blur-2xl" />
      <div className="premium-card relative rounded-[1.75rem] p-5">
        <div className="mb-5 flex items-center justify-between rounded-2xl bg-[#F8FAFC] p-4 ring-1 ring-slate-100">
          <div>
            <p className="text-sm font-black text-[#0F172A]">📊 National Risk Overview</p>
            <p className="mt-1 text-xs font-medium text-[#1E293B]/60">AI-assisted LGU analytics snapshot</p>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-sm shadow-sm ring-1 ring-[#38BDF8]/30">
            🤖
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['312', 'High Risk', getRiskBadgeClass('High')],
            ['54.7', 'Avg Score', 'bg-amber-50 text-amber-700'],
            ['78', 'Critical', getRiskBadgeClass('Critical')],
          ].map(([value, label, tone]) => (
            <div key={label} className="rounded-2xl border border-[#38BDF8]/35 bg-white p-4 shadow-sm shadow-slate-200/80">
              <p className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${tone}`}>{label}</p>
              <p className="mt-3 text-2xl font-black text-[#0F172A]">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_190px]">
          <div className="rounded-2xl border border-[#38BDF8]/35 bg-white p-4 shadow-sm shadow-slate-200/80">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#1E293B]/60">Risk trend</p>
              <span className="rounded-full bg-[#F8FAFC] px-2.5 py-1 text-xs font-bold text-[#2563EB]">2026</span>
            </div>
            <div className="mb-4 flex items-end gap-2">
              {bars.map((height, index) => (
                <div
                  key={height + index}
                  className="animated-chart-bar w-full rounded-t-lg bg-gradient-to-t from-[#2563EB] to-[#38BDF8]"
                  style={{
                    '--bar-delay': `${index * 80}ms`,
                    '--bar-opacity': 0.46 + index * 0.06,
                    height: `${height * 1.35}px`,
                    opacity: 0.46 + index * 0.06,
                  }}
                />
              ))}
            </div>
            <div className="space-y-2">
              <div className="animated-progress h-2 rounded-full bg-[#E2E8F0]" style={{ '--progress-delay': '620ms' }} />
              <div className="animated-progress h-2 w-4/5 rounded-full bg-[#E2E8F0]" style={{ '--progress-delay': '760ms' }} />
            </div>
          </div>

          <div className="rounded-2xl border border-[#38BDF8]/35 bg-gradient-to-br from-[#F8FAFC] to-white p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[#2563EB]">Selected LGU</p>
            <p className="mt-2 text-4xl font-black text-[#0F172A]">94</p>
            <p className="text-xs font-semibold text-[#2563EB]">Critical review</p>
            <div className="mt-4 space-y-2">
              <div className="animated-progress h-2 rounded-full bg-red-300" style={{ '--progress-delay': '520ms' }} />
              <div className="animated-progress h-2 rounded-full bg-amber-300" style={{ '--progress-delay': '660ms' }} />
              <div className="animated-progress h-2 rounded-full bg-[#38BDF8]" style={{ '--progress-delay': '800ms' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickActions() {
  const actions = [
    ['🔎', 'Inspect risks', 'Review score drivers'],
    ['🗺️', 'Map signals', 'Locate regional patterns'],
    ['📄', 'Export reports', 'Prepare summaries'],
  ]

  return (
    <div className="mt-10 grid gap-3 sm:grid-cols-3">
      {actions.map(([emoji, title, text]) => (
        <div
          key={title}
          className="soft-hover reveal-on-scroll rounded-2xl border border-[#38BDF8]/35 bg-white/90 p-4 text-left shadow-sm shadow-[#0F172A]/5 backdrop-blur hover:border-[#38BDF8]/70 hover:shadow-xl hover:shadow-[#0F172A]/10"
          style={{ '--reveal-delay': `${actions.findIndex((item) => item[1] === title) * 90}ms` }}
        >
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-3xl shadow-sm ring-1 ring-[#38BDF8]/35">
            {emoji}
          </div>
          <p className="mt-2 text-sm font-black text-[#0F172A]">{title}</p>
          <p className="mt-1 text-xs leading-5 text-[#1E293B]/65">{text}</p>
        </div>
      ))}
    </div>
  )
}

export default function HeroSection() {
  return (
    <section id="home" className="relative flex min-h-[calc(100vh-84px)] items-center overflow-hidden pb-10 pt-4 sm:pb-12 sm:pt-6">
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-8">
        <div className="reveal-on-scroll mx-auto max-w-3xl text-center lg:text-left">
          <p className="mb-4 inline-flex rounded-full border border-[#38BDF8]/30 bg-white px-4 py-2 text-sm font-bold text-[#2563EB] shadow-sm">
            🇵🇭 Public LGU risk intelligence portal
          </p>
          <h1 className="text-4xl font-black tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl">
            AI-Powered Transparency for Philippine LGUs
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#1E293B]/80 lg:mx-0">
            Bantay Bayan helps citizens and institutions monitor LGU risk indicators using AI-driven analytics and audit insights.
          </p>

          <div className="mt-7 flex justify-center lg:justify-start">
            <Link
              to="/dashboard"
              className="btn-shine premium-button button-hover bg-[#2563EB] px-9 py-4 text-center text-base font-black text-white hover:bg-[#0F172A] hover:shadow-xl"
            >
              Open Dashboard
            </Link>
          </div>

          <div className="hidden lg:block">
            <QuickActions />
          </div>
        </div>

        <DashboardPreview />
      </div>
    </section>
  )
}
