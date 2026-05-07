import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Card from '../ui/Card'

function RiskTrendChart({ data }) {
  const riskTrendData = data || []

  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-base font-semibold text-[#0F172A]">Risk Trend</h2>
        <p className="mt-1 text-sm text-[#1E293B]/65">Average risk score from 2019 to 2023</p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={riskTrendData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" />
            <XAxis dataKey="year" stroke="#64748B" tickLine={false} axisLine={false} />
            <YAxis stroke="#64748B" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                color: '#1E293B',
              }}
              labelStyle={{ color: '#0F172A' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={{ r: 4, fill: '#38bdf8', strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export default RiskTrendChart
