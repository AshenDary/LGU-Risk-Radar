function InfoBanner({ text }) {
  return (
    <div className="flex gap-3 rounded-xl border border-[#38BDF8]/30 bg-white px-4 py-3 text-sm leading-6 text-[#1E293B]/80 shadow-sm shadow-slate-200/80">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#38BDF8]/15 text-xs font-bold text-[#2563EB]">
        i
      </span>
      <p>{text}</p>
    </div>
  )
}

export default InfoBanner
