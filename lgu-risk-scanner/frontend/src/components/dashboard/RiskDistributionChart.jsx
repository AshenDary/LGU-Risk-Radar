import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import Card from '../ui/Card'

const categoryColors = {
  Critical: '#f87171',
  High: '#fb923c',
  Medium: '#facc15',
  Low: '#34d399',
}

function RiskDistributionChart({ data }) {
  const riskDistributionData = data || []

  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-base font-semibold text-white">Risk Distribution</h2>
        <p className="mt-1 text-sm text-cyan-50/60">LGUs grouped by current risk category</p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={riskDistributionData}
              dataKey="value"
              nameKey="name"
              innerRadius="58%"
              outerRadius="82%"
              paddingAngle={3}
            >
              {riskDistributionData.map((entry) => (
                <Cell key={entry.name} fill={categoryColors[entry.name]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#09090b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                color: '#ffffff',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {riskDistributionData.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-sm text-cyan-50/75">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: categoryColors[item.name] }}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default RiskDistributionChart
