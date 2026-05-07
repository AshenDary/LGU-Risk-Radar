import { Link } from 'react-router-dom'

export default function CTASection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#2563EB] to-[#38BDF8] px-6 py-16 text-center shadow-2xl shadow-[#0F172A]/20 sm:px-10">
          <div className="absolute left-8 top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 right-8 h-40 w-40 rounded-full bg-sky-300/20 blur-3xl" />
          <div className="relative">
            <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              Explore LGU Risk Insights Across the Philippines
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-blue-50/80">
              Open the dashboard to inspect rankings, trends, risk indicators, and audit insight views.
            </p>
            <Link
              to="/dashboard"
              className="btn-shine btn-shine-dark button-hover mt-8 inline-flex rounded-lg bg-white px-8 py-3 text-sm font-black text-[#0F172A] shadow-lg hover:bg-[#F8FAFC] hover:text-[#2563EB] hover:shadow-xl"
            >
              Launch Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
