import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { NCR_CITIES, getMonthlyScoresForCity, getMonthlyProcurementForCity, MONTHS } from '../../data/mockData'

function RiskOverview() {
  const [selectedCity, setSelectedCity] = useState('all')

  // Calculate average score across all cities (most recent month)
  const avgScore = useMemo(() => {
    const scores = NCR_CITIES.map((city) => {
      const monthlyData = getMonthlyScoresForCity(city.id)
      const recentMonths = monthlyData.filter(d => d.score !== null)
      return recentMonths.length > 0 ? recentMonths[recentMonths.length - 1].score : 0
    })
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
  }, [])

  // Find highest and lowest risk cities
  const riskCities = useMemo(() => {
    const cityScores = NCR_CITIES.map((city) => {
      const monthlyData = getMonthlyScoresForCity(city.id)
      const recentMonths = monthlyData.filter(d => d.score !== null)
      const score = recentMonths.length > 0 ? recentMonths[recentMonths.length - 1].score : 0
      return { name: city.name, score }
    })
    cityScores.sort((a, b) => b.score - a.score)
    return {
      highest: cityScores[0],
      lowest: cityScores[cityScores.length - 1],
    }
  }, [])

  // Calculate total procurement value (current month across all cities or selected city)
  const totalProcurement = useMemo(() => {
    if (selectedCity === 'all') {
      let total = 0
      NCR_CITIES.forEach((city) => {
        const monthlyData = getMonthlyProcurementForCity(city.id)
        const recent = monthlyData.find(d => d.value !== null)
        if (recent) total += recent.value
      })
      return total
    } else {
      const monthlyData = getMonthlyProcurementForCity(parseInt(selectedCity))
      const recent = monthlyData.find(d => d.value !== null)
      return recent ? recent.value : 0
    }
  }, [selectedCity])

  // Generate chart data for procurement
  const chartData = useMemo(() => {
    if (selectedCity === 'all') {
      // Sum procurement across all cities for each month
      const allMonthlyData = {}
      MONTHS.forEach((month, idx) => {
        allMonthlyData[month] = 0
      })

      NCR_CITIES.forEach((city) => {
        const monthlyData = getMonthlyProcurementForCity(city.id)
        monthlyData.forEach((item) => {
          if (item.value !== null) {
            allMonthlyData[item.month] += item.value
          }
        })
      })

      return MONTHS.map((month) => ({
        month: month.slice(0, 3),
        value: allMonthlyData[month],
      }))
    } else {
      const monthlyData = getMonthlyProcurementForCity(parseInt(selectedCity))
      return monthlyData.map((item) => ({
        month: item.month.slice(0, 3),
        value: item.value,
      }))
    }
  }, [selectedCity])

  const getRiskColor = (score) => {
    if (score >= 70) return '#dc2626'
    if (score >= 40) return '#eab308'
    return '#16a34a'
  }

  return (
    <div className="grid gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Score */}
        <div className="bg-[#0f2e47] rounded-lg p-6 border border-[#1a3a52]">
          <div className="text-sm text-gray-400 mb-2">Average Risk Score</div>
          <div className="text-3xl font-bold text-white">{avgScore}</div>
          <div className="text-xs text-gray-500 mt-2">Across all NCR cities</div>
        </div>

        {/* Highest Risk City */}
        <div className="bg-[#0f2e47] rounded-lg p-6 border border-[#1a3a52]">
          <div className="text-sm text-gray-400 mb-2">Highest Risk City</div>
          <div className="text-lg font-bold text-white">{riskCities.highest.name}</div>
          <div
            className="text-2xl font-bold mt-2"
            style={{ color: getRiskColor(riskCities.highest.score) }}
          >
            {riskCities.highest.score}
          </div>
        </div>

        {/* Lowest Risk City */}
        <div className="bg-[#0f2e47] rounded-lg p-6 border border-[#1a3a52]">
          <div className="text-sm text-gray-400 mb-2">Lowest Risk City</div>
          <div className="text-lg font-bold text-white">{riskCities.lowest.name}</div>
          <div
            className="text-2xl font-bold mt-2"
            style={{ color: getRiskColor(riskCities.lowest.score) }}
          >
            {riskCities.lowest.score}
          </div>
        </div>

        {/* Total Procurement Value */}
        <div className="bg-[#0f2e47] rounded-lg p-6 border border-[#1a3a52]">
          <div className="text-sm text-gray-400 mb-2">Total Procurement Value</div>
          <div className="text-2xl font-bold text-white">₱{(totalProcurement / 1000).toFixed(1)}B</div>
          <div className="text-xs text-gray-500 mt-2">{selectedCity === 'all' ? 'All cities' : 'Selected city'}</div>
        </div>
      </div>

      {/* Procurement Chart */}
      <div className="bg-[#0f2e47] rounded-lg p-6 border border-[#1a3a52]">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">12-Month Procurement Trend</h3>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-[#0a2240] text-white px-4 py-2 rounded border border-[#1a3a52] text-sm"
            >
              <option value="all">All Cities</option>
              {NCR_CITIES.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" label={{ value: '₱ Millions', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0a2240', border: '1px solid #1a3a52', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value) => [`₱${value}M`, 'Value']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#06b6d4"
                strokeWidth={2}
                name="Procurement Value"
                dot={{ fill: '#06b6d4', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default RiskOverview
