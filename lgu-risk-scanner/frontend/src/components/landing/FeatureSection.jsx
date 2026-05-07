import SolidIcon from './SolidIcon'

const features = [
  {
    icon: 'chart',
    title: 'Risk scoring dashboard',
    description: 'Monitor computed LGU risk scores, distribution trends, and priority review targets from one workspace.',
  },
  {
    icon: 'search',
    title: 'AI-assisted analysis',
    description: 'Generate explanations, ask follow-up questions, and translate risk factors into reviewer-ready summaries.',
  },
  {
    icon: 'map',
    title: 'Geographic risk mapping',
    description: 'Explore regional and city-level patterns with map-first views for fast scanning and comparison.',
  },
  {
    icon: 'database',
    title: 'Supabase-backed records',
    description: 'Centralize LGU, procurement, audit, and risk score data behind a controlled backend API.',
  },
  {
    icon: 'sliders',
    title: 'What-if simulation',
    description: 'Adjust scenario inputs to understand how procurement behavior and data quality can shift risk levels.',
  },
  {
    icon: 'document',
    title: 'Report generation',
    description: 'Build structured risk reports from selected LGUs with notes, audit context, and generated findings.',
  },
  {
    icon: 'compare',
    title: 'LGU comparison tools',
    description: 'Compare LGU profiles side by side to find score gaps, factor differences, and review priorities.',
  },
  {
    icon: 'lock',
    title: 'Security-aware backend',
    description: 'Use CORS controls, trusted hosts, security headers, input utilities, and rate limiting foundations.',
  },
]

export default function FeatureSection() {
  return (
    <section id="features" className="flex min-h-screen items-center py-14 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal-on-scroll mx-auto max-w-4xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#2563EB]">Features</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0F172A] sm:text-5xl">
            Built for public-sector risk visibility
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-[#1E293B]/80 sm:text-lg sm:leading-8">
            Bantay Bayan brings scoring, visualization, audit exploration, simulation, and reporting together in a responsive professional dashboard.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="premium-card premium-hover reveal-on-scroll group rounded-2xl p-5"
              style={{ '--reveal-delay': `${index * 70}ms` }}
            >
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-[#2563EB] text-white shadow-sm transition-transform duration-300 ease-out group-hover:scale-[1.04]">
                <SolidIcon name={feature.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-black leading-6 text-[#0F172A]">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#1E293B]/75">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
