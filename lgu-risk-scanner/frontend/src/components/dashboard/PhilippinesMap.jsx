import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import Card from '../ui/Card'

const RISK_COLOR_MAP = {
  critical: '#DC2626',
  high: '#F97316',
  medium: '#EAB308',
  low: '#22C55E',
}

const DEFAULT_CENTER = [12.8797, 121.7740]
const DEFAULT_ZOOM = 6

function PhilippinesMap() {
  const [points, setPoints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const apiUrl = (import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000').replace(/\/+$/, '')
    window
      .fetch(`${apiUrl}/lgu/risk-map`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API error ${response.status}`)
        }
        return response.json()
      })
      .then((data) => setPoints(data || []))
      .catch((err) => setError(err.message || 'Unable to load map data'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#0F172A]">Risk Map</h2>
          <p className="text-sm text-slate-500">
            Geographic distribution of LGU procurement risk across the Philippines.
          </p>
        </div>
      </div>

      <div className="h-[560px] rounded-xl border border-slate-200 bg-slate-50">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-600">
            Loading risk map...
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-red-600">
            <div>
              <p className="font-semibold">Unable to load map data</p>
              <p>{error}</p>
            </div>
          </div>
        ) : points.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-600">
            No LGU risk coordinates available yet.
          </div>
        ) : (
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            scrollWheelZoom={true}
            className="h-full w-full rounded-xl"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {points.map((point) => {
              const color = RISK_COLOR_MAP[point.risk_level?.toLowerCase()] ?? '#0F172A'

              return (
                <CircleMarker
                  key={point.id}
                  center={[point.latitude, point.longitude]}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.8,
                  }}
                  radius={10}
                >
                  <Popup>
                    <div className="max-w-xs">
                      <strong className="block text-sm font-semibold">{point.name || point.id}</strong>
                      <p className="text-xs text-slate-600">{point.location}</p>
                      <p className="mt-2 text-sm">
                        <span className="font-medium">Risk score:</span> {point.risk_score ?? 'n/a'}
                      </p>
                      <p className="text-sm capitalize">
                        <span className="font-medium">Risk level:</span> {point.risk_level || 'unknown'}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>
        )}
      </div>
    </Card>
  )
}

export default PhilippinesMap
