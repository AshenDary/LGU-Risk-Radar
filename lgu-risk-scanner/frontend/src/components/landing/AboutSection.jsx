export default function AboutSection() {
  return (
    <section id="about" className="flex min-h-screen items-center py-14 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="reveal-on-scroll">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#2563EB]">About</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0F172A] sm:text-5xl">
              Transparency, accountability, and data-driven governance
            </h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-[#1E293B]/80 sm:text-lg">
              <p>
                Bantay Bayan is a public government-tech analytics application designed to help citizens, researchers, and oversight teams understand LGU risk indicators through clear visual summaries.
              </p>
              <p>
                The platform organizes procurement signals, audit insights, ranking views, and scenario tools into a modern dashboard that supports informed conversations about public spending and local governance.
              </p>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {[
                ['🔎', 'Transparency'],
                ['⚖️', 'Accountability'],
                ['📊', 'Data-driven governance'],
              ].map(([emoji, item]) => (
                <div
                  key={item}
                  className="premium-card premium-hover reveal-on-scroll flex min-h-24 flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center"
                  style={{ '--reveal-delay': `${[
                    'Transparency',
                    'Accountability',
                    'Data-driven governance',
                  ].indexOf(item) * 90}ms` }}
                >
                  <span className="text-3xl leading-none">{emoji}</span>
                  <span className="text-sm font-black leading-5 text-[#0F172A]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card reveal-on-scroll relative rounded-3xl p-6">
            <div className="relative">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Governance view</p>
                  <p className="mt-1 text-lg font-black text-[#0F172A]">Public accountability signals</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Open data</span>
              </div>
              <div className="space-y-4">
                {[
                  ['Procurement patterns', '78%'],
                  ['Audit visibility', '64%'],
                  ['Supplier diversity', '52%'],
                  ['Report readiness', '88%'],
                ].map(([label, width]) => (
                  <div key={label}>
                    <div className="mb-2 flex justify-between text-sm font-semibold text-[#1E293B]/75">
                      <span>{label}</span>
                      <span>{width}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#38BDF8]" style={{ width }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
