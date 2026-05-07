const features = [
  {
    icon: '🤖',
    title: 'AI Risk Analysis',
    description: 'Surface risk signals from procurement patterns, audit findings, and governance indicators.',
  },
  {
    icon: '🏛️',
    title: 'LGU Ranking',
    description: 'Compare LGUs by risk score to prioritize review and oversight activities.',
  },
  {
    icon: '🗺️',
    title: 'Geographic Risk Mapping',
    description: 'Explore geographic patterns with clear regional risk overlays and status indicators.',
  },
  {
    icon: '🔍',
    title: 'Audit Explorer',
    description: 'Review audit-related signals and plain-language explanations in one workspace.',
  },
  {
    icon: '🧪',
    title: 'What-If Simulation',
    description: 'Adjust key factors to understand how procurement behavior can shift risk levels.',
  },
  {
    icon: '📄',
    title: 'Report Generation',
    description: 'Prepare concise summaries for documentation, discussion, and decision-making.',
  },
]

export default function FeatureSection() {
  return (
    <section id="features" className="flex min-h-screen items-center py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal-on-scroll mx-auto max-w-4xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#2563EB]">Features</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0F172A] sm:text-5xl">
            Built for public-sector risk visibility
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#1E293B]/80">
            Bantay Bayan brings analytics, visualization, and reporting together in a single professional dashboard.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="premium-card premium-hover reveal-on-scroll group rounded-3xl p-5"
              style={{ '--reveal-delay': `${features.findIndex((item) => item.title === feature.title) * 80}ms` }}
            >
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-3xl shadow-sm ring-1 ring-[#38BDF8]/35 transition-transform duration-300 ease-out group-hover:scale-[1.04]">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-lg font-black text-[#0F172A]">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#1E293B]/75">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
