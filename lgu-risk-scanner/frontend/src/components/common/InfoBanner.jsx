function InfoBanner({ text }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-[#38BDF8]/30 bg-[#EFF6FF] px-4 py-3 text-sm font-medium leading-6 text-[#2563EB]">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#38BDF8]/60 bg-white text-xs font-black text-[#2563EB]">
        i
      </span>
      <p>{text}</p>
    </div>
  )
}

export default InfoBanner
