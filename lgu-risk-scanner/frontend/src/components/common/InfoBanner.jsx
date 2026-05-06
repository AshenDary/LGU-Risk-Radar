function InfoBanner({ text }) {
  return (
    <div className="flex gap-3 rounded-xl border border-cyan-300/20 bg-[#062338] px-4 py-3 text-sm leading-6 text-cyan-50/80 shadow-sm shadow-black/10">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-300/15 text-xs font-bold text-cyan-200">
        i
      </span>
      <p>{text}</p>
    </div>
  )
}

export default InfoBanner
