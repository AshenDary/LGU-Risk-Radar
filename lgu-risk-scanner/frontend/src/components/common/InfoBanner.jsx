function InfoBanner({ text }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#38BDF8]/35 bg-[#EFF6FF] px-4 py-3 text-[#2563EB]">
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[#38BDF8]/60 text-xs font-black">
        i
      </span>
      <p className="text-sm font-semibold leading-6">{text}</p>
    </div>
  )
}

export default InfoBanner
