import { useMemo, useState } from 'react'
import Card from '../ui/Card'
import InfoBanner from '../common/InfoBanner'
import { getNCRScoresForChart } from '../../data/mockData'
import { philippinesCountryPaths, philippinesMapViewBox } from '../../data/philippinesMapPaths'
import { useRiskData } from '../../hooks/useRiskData'

const mapPositions = {
  Manila: { x: 278.5, y: 354 },
  'Quezon City': { x: 281.7, y: 349.9 },
  Caloocan: { x: 277.6, y: 351.3 },
  'Las Pinas': { x: 279, y: 362.2 },
  'Las Piñas': { x: 279, y: 362.2 },
  'Las PiÃ±as': { x: 279, y: 362.2 },
  Makati: { x: 280.6, y: 356.4 },
  Malabon: { x: 277, y: 350.3 },
  Mandaluyong: { x: 281.2, y: 355.1 },
  Marikina: { x: 284.8, y: 351.3 },
  Muntinlupa: { x: 282, y: 364.1 },
  Navotas: { x: 276.6, y: 350.4 },
  Paranaque: { x: 280.3, y: 360.4 },
  'Parañaque': { x: 280.3, y: 360.4 },
  'ParaÃ±aque': { x: 280.3, y: 360.4 },
  Pasay: { x: 279.4, y: 357.3 },
  Pasig: { x: 283.8, y: 355.2 },
  'San Juan': { x: 281.7, y: 353.7 },
  Taguig: { x: 282, y: 358.3 },
  Valenzuela: { x: 278.4, y: 348.6 },
}

const riskStyles = {
  Critical: 'border-red-500 bg-red-500 text-white shadow-red-500/30',
  High: 'border-orange-500 bg-orange-500 text-white shadow-orange-500/30',
  Medium: 'border-amber-400 bg-amber-300 text-[#78350F] shadow-amber-400/25',
  Low: 'border-emerald-500 bg-emerald-500 text-white shadow-emerald-500/30',
}

const mapViews = {
  ncr: {
    label: 'NCR',
    viewBox: '269 341 27 30',
    center: { x: 282.5, y: 356 },
    markerScale: 1.05,
  },
  metro: {
    label: 'Metro',
    viewBox: '263 335 42 48',
    center: { x: 284, y: 357 },
    markerScale: 1.45,
  },
  regional: {
    label: 'Region',
    viewBox: '250 320 70 85',
    center: { x: 285, y: 362 },
    markerScale: 2.05,
  },
  luzon: {
    label: 'Luzon',
    viewBox: '190 210 210 260',
    center: { x: 295, y: 340 },
    markerScale: 3.25,
  },
}
const mapViewOrder = ['ncr', 'metro', 'regional', 'luzon']

function parseViewBox(viewBox) {
  const [x, y, width, height] = viewBox.split(' ').map(Number)
  return { x, y, width, height }
}

function normalizeName(name) {
  return name.replace(/^City of /, '').replace(/^Municipality of /, '')
}

function normalizeRiskLevel(level, score) {
  if (level) return level
  if (score >= 85) return 'Critical'
  if (score >= 75) return 'High'
  if (score >= 40) return 'Medium'
  return 'Low'
}

function getLabelWidth(name, markerSize) {
  return Math.max(10, name.length * 1.05) * markerSize
}

function PhilippinesMap() {
  const { chartRows, loading, error } = useRiskData()
  const [zoom, setZoom] = useState(1)
  const [mapView, setMapView] = useState('ncr')
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState(null)
  const [hoveredCity, setHoveredCity] = useState('')
  const currentMapView = mapViews[mapView]
  const currentViewBox = useMemo(() => {
    const base = parseViewBox(currentMapView.viewBox)
    return `${base.x + pan.x} ${base.y + pan.y} ${base.width} ${base.height}`
  }, [currentMapView.viewBox, pan])
  const markerSize = currentMapView.markerScale / zoom
  const labelSize = Math.min(markerSize, 1.18)
  const fallbackRows = getNCRScoresForChart()
  const rows = (chartRows.length ? chartRows : fallbackRows)
    .map((row) => ({
      ...row,
      name: normalizeName(row.name),
      riskLevel: normalizeRiskLevel(row.riskLevel, row.score),
    }))
    .filter((row) => mapPositions[row.name])
    .sort((a, b) => b.score - a.score)
  const topRows = rows.slice(0, 5)

  function zoomIn() {
    if (zoom > 1) {
      setZoom((current) => Math.min(2, Number((current + 0.25).toFixed(2))))
      return
    }

    const currentIndex = mapViewOrder.indexOf(mapView)
    if (currentIndex > 0) {
      setMapView(mapViewOrder[currentIndex - 1])
      setZoom(1)
      setPan({ x: 0, y: 0 })
      return
    }

    setZoom((current) => Math.min(2, Number((current + 0.25).toFixed(2))))
  }

  function zoomOut() {
    if (zoom > 1) {
      setZoom((current) => Math.max(1, Number((current - 0.25).toFixed(2))))
      return
    }

    const currentIndex = mapViewOrder.indexOf(mapView)
    setMapView(mapViewOrder[Math.min(mapViewOrder.length - 1, currentIndex + 1)])
    setPan({ x: 0, y: 0 })
  }

  function handlePointerDown(event) {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragStart({
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      pan,
    })
  }

  function handlePointerMove(event) {
    if (!dragStart || dragStart.pointerId !== event.pointerId) return

    const base = parseViewBox(currentMapView.viewBox)
    const bounds = event.currentTarget.getBoundingClientRect()
    const dx = ((event.clientX - dragStart.clientX) / bounds.width) * base.width
    const dy = ((event.clientY - dragStart.clientY) / bounds.height) * base.height

    setPan({
      x: dragStart.pan.x - dx,
      y: dragStart.pan.y - dy,
    })
  }

  function handlePointerUp(event) {
    if (!dragStart || dragStart.pointerId !== event.pointerId) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    setDragStart(null)
  }

  return (
    <Card>
      <div className="mb-7">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Map view</p>
        <h2 className="mt-2 text-3xl font-black leading-tight text-[#0F172A]">Luzon NCR Risk Map</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-[#475569]">
          {chartRows.length ? 'Latest city-level risk scores.' : 'Sample city-level risk scores for preview.'}
        </p>
        <div className="mt-3">
          <InfoBanner text="Future builds can make this map interactive with clickable LGUs, filters, and drill-down risk details." />
        </div>
      </div>

      {error ? (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
          Backend data unavailable, showing bundled sample data.
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="relative min-h-[32rem] overflow-hidden rounded-2xl border border-[#38BDF8]/30 bg-[#E0F2FE] p-4 shadow-inner shadow-[#2563EB]/10">
          <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={zoomOut}
              disabled={mapView === mapViewOrder[mapViewOrder.length - 1] && zoom <= 1}
              aria-label="Zoom out one map level"
              title="Zoom out one level"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/80 bg-white/95 text-2xl font-black leading-none text-[#2563EB] shadow-lg shadow-[#2563EB]/10 transition hover:bg-[#EFF6FF] disabled:cursor-not-allowed disabled:opacity-40"
            >
              -
            </button>
            <button
              type="button"
              onClick={zoomIn}
              disabled={mapView === 'ncr' && zoom >= 2}
              aria-label="Zoom in one map level"
              title="Zoom in one level"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/80 bg-white/95 text-2xl font-black leading-none text-[#2563EB] shadow-lg shadow-[#2563EB]/10 transition hover:bg-[#EFF6FF] disabled:cursor-not-allowed disabled:opacity-40"
            >
              +
            </button>
          </div>

          <svg
            className={`absolute inset-0 h-full w-full touch-none select-none ${dragStart ? 'cursor-grabbing' : 'cursor-grab'}`}
            viewBox={currentViewBox}
            role="img"
            aria-label="Map focused on Luzon and NCR risk markers"
            preserveAspectRatio="xMidYMid meet"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <defs>
              <linearGradient id="philippines-map-fill" x1="0" x2="1" y1="0" y2="1">
                <stop stopColor="#FFFFFF" />
                <stop offset="0.55" stopColor="#DBEAFE" />
                <stop offset="1" stopColor="#BAE6FD" />
              </linearGradient>
              <filter id="map-shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#1D4ED8" floodOpacity="0.14" />
              </filter>
            </defs>

            <rect width="640" height="900" fill="#E0F2FE" />
            <g transform={`translate(${currentMapView.center.x} ${currentMapView.center.y}) scale(${zoom}) translate(-${currentMapView.center.x} -${currentMapView.center.y})`}>
              <g filter="url(#map-shadow)">
                {philippinesCountryPaths.map((path) => (
                  <path
                    key={path}
                    d={path}
                    fill="url(#philippines-map-fill)"
                    stroke="#2563EB"
                    strokeOpacity="0.42"
                    strokeWidth="1.2"
                  />
                ))}
              </g>

              <circle cx="280.5" cy="355.2" r="14" fill="#2563EB" opacity="0.10" />
              <circle cx="280.5" cy="355.2" r="6" fill="#2563EB" opacity="0.16" />
              {rows.map((row) => {
                const position = mapPositions[row.name]
                const color = row.riskLevel === 'Critical'
                  ? '#EF4444'
                  : row.riskLevel === 'High'
                    ? '#F97316'
                    : row.riskLevel === 'Medium'
                      ? '#FBBF24'
                      : '#10B981'

                return (
                  <g
                    key={row.name}
                    onPointerEnter={() => setHoveredCity(row.name)}
                    onPointerLeave={() => setHoveredCity('')}
                  >
                    <title>{`${row.name}: ${row.score} (${row.riskLevel})`}</title>
                    <circle cx={position.x} cy={position.y} r={2.35 * markerSize} fill={color} opacity="0.16" />
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r={1.48 * markerSize}
                      fill={color}
                      stroke="#FFFFFF"
                      strokeWidth={0.3 * markerSize}
                    />
                    <text
                      x={position.x}
                      y={position.y + 0.52 * markerSize}
                      fill="#FFFFFF"
                      fontSize={0.96 * markerSize}
                      fontWeight="900"
                      textAnchor="middle"
                    >
                      {Math.round(row.score)}
                    </text>
                  </g>
                )
              })}
              {hoveredCity ? (() => {
                const position = mapPositions[hoveredCity]
                const labelWidth = getLabelWidth(hoveredCity, labelSize) * 0.88

                return (
                  <g className="pointer-events-none">
                    <rect
                      x={position.x - labelWidth / 2}
                      y={position.y - 6.9 * labelSize}
                      width={labelWidth}
                      height={2.45 * labelSize}
                      rx={0.55 * labelSize}
                      fill="#FFFFFF"
                      stroke="#2563EB"
                      strokeWidth={0.08 * labelSize}
                      opacity="0.97"
                    />
                    <text
                      x={position.x}
                      y={position.y - 5.25 * labelSize}
                      fill="#2563EB"
                      fontSize={0.92 * labelSize}
                      fontWeight="800"
                      textAnchor="middle"
                    >
                      {hoveredCity}
                    </text>
                  </g>
                )
              })() : null}
            </g>
          </svg>

          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 rounded-2xl border border-white/70 bg-white/85 p-3 text-xs font-bold text-[#0F172A] shadow-sm">
            {Object.entries(riskStyles).map(([level, classes]) => (
              <span key={level} className="inline-flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full border ${classes}`} />
                {level}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#38BDF8]/25 bg-white p-5 shadow-sm shadow-slate-200/70">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2563EB]">Highest risk</p>
              <h3 className="mt-1 text-xl font-black text-[#0F172A]">Priority LGUs</h3>
            </div>
            {loading ? <span className="text-xs font-bold text-[#64748B]">Loading</span> : null}
          </div>

          <div className="space-y-3">
            {topRows.map((row, index) => (
              <div key={row.name} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-[#0F172A]">
                      {index + 1}. {row.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#64748B]">{row.riskLevel} risk</p>
                  </div>
                  <span className="shrink-0 text-2xl font-black text-[#2563EB]">{Math.round(row.score)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default PhilippinesMap
