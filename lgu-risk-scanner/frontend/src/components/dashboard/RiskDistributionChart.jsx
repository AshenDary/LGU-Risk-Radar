import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import Card from '../ui/Card'

const categoryColors = {
  Critical: '#DC2626',
  High: '#F97316',
  Medium: '#EAB308',
  Low: '#16A34A',
}

function RiskDistributionChart({ data }) {
  const riskDistributionData = data || []

  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-base font-semibold text-[#0F172A]">Risk Distribution</h2>
        <p className="mt-1 text-sm text-[#1E293B]/65">LGUs grouped by current risk category</p>
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
                backgroundColor: '#ffffff',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                color: '#1E293B',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {riskDistributionData.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-sm text-[#1E293B]/75">
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
