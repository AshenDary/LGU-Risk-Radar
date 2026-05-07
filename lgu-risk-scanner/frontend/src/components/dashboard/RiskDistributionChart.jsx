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
      <div className="mb-7">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Overview</p>
        <h2 className="mt-2 text-3xl font-black leading-tight text-[#0F172A]">Risk Distribution</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-[#2563EB]">LGUs grouped by current risk category</p>
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
                border: '1px solid #BAE6FD',
                borderRadius: '12px',
                color: '#0F172A',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {riskDistributionData.map((item) => (
          <div key={item.name} className="flex items-center gap-2 rounded-2xl border border-[#38BDF8]/20 bg-[#F8FAFC] px-3 py-2 text-sm font-semibold text-[#0F172A]">
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
