import Badge from '../ui/Badge'
import Card from '../ui/Card'

const riskLevelClasses = {
  Critical: 'border-red-200 bg-red-50 text-red-700',
  High: 'border-orange-200 bg-orange-50 text-orange-700',
  Medium: 'border-yellow-200 bg-yellow-50 text-yellow-700',
  Low: 'border-green-200 bg-green-50 text-green-700',
}

function TopRiskTable({ rows, selectedId, onSelect }) {
  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-base font-semibold text-[#0F172A]">Top Risk LGUs</h2>
        <p className="mt-1 text-sm text-[#1E293B]/65">Highest ranked LGUs by current risk score</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-[#F8FAFC] text-xs uppercase text-[#1E293B]/60">
              <th className="px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">LGU</th>
              <th className="px-4 py-3 font-medium">Risk Score</th>
              <th className="px-4 py-3 font-medium">Risk Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((item, index) => (
              <tr
                key={item.id}
                onClick={() => onSelect?.(item)}
                className={`cursor-pointer text-sm text-[#1E293B]/75 transition hover:bg-[#F8FAFC] ${
                  selectedId === item.id ? 'bg-[#38BDF8]/10' : ''
                }`}
              >
                <td className="px-4 py-4 font-medium text-[#1E293B]/60">{index + 1}</td>
                <td className="px-4 py-4 font-medium text-[#0F172A]">{item.name}</td>
                <td className="px-4 py-4">{item.score.toFixed(2)}</td>
                <td className="px-4 py-4">
                  <Badge className={riskLevelClasses[item.riskLevel]}>{item.riskLevel}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default TopRiskTable
