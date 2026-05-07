import Card from '../ui/Card'

function PhilippinesMap() {
  return (
    <Card>
      <div className="mb-7">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Map view</p>
        <h2 className="mt-2 text-3xl font-black leading-tight text-[#0F172A]">Risk Map</h2>
      </div>

      <div className="flex h-96 items-center justify-center rounded-2xl border border-dashed border-[#38BDF8]/35 bg-[#EFF6FF]">
        <span className="text-sm font-semibold text-[#2563EB]">Map placeholder</span>
      </div>
    </Card>
  )
}

export default PhilippinesMap
