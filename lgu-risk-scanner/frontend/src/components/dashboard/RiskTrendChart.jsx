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
      <div className="mb-7">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Trend</p>
        <h2 className="mt-2 text-3xl font-black leading-tight text-[#0F172A]">Risk Trend</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-[#2563EB]">Average risk score from 2019 to 2023</p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={riskTrendData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#DBEAFE" strokeDasharray="4 4" />
            <XAxis dataKey="year" stroke="#64748B" tickLine={false} axisLine={false} />
            <YAxis stroke="#64748B" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #BAE6FD',
                borderRadius: '12px',
                color: '#0F172A',
              }}
              labelStyle={{ color: '#0F172A' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563EB"
              strokeWidth={3}
              dot={{ r: 4, fill: '#2563EB', strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export default RiskTrendChart
