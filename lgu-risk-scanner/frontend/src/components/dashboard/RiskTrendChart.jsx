import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { riskTrendData } from '../../data/mockData'
import Card from '../ui/Card'

function RiskTrendChart() {
  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-base font-semibold text-white">Risk Trend</h2>
        <p className="mt-1 text-sm text-cyan-50/60">Average risk score from 2019 to 2023</p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={riskTrendData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#27272a" strokeDasharray="4 4" />
            <XAxis dataKey="year" stroke="#a1a1aa" tickLine={false} axisLine={false} />
            <YAxis stroke="#a1a1aa" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#09090b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                color: '#ffffff',
              }}
              labelStyle={{ color: '#ffffff' }}
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
