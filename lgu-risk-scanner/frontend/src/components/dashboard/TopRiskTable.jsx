import Badge from '../ui/Badge'
import Card from '../ui/Card'

const riskLevelClasses = {
  Critical: 'border-red-500/30 bg-red-500/10 text-red-300',
  High: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
  Medium: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
  Low: 'border-green-500/30 bg-green-500/10 text-green-300',
}

function TopRiskTable({ rows, selectedId, onSelect }) {
  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-base font-semibold text-white">Top Risk LGUs</h2>
        <p className="mt-1 text-sm text-cyan-50/60">Highest ranked LGUs by current risk score</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-cyan-200/10 text-xs uppercase text-cyan-50/45">
              <th className="px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">LGU</th>
              <th className="px-4 py-3 font-medium">Risk Score</th>
              <th className="px-4 py-3 font-medium">Risk Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-200/10">
            {rows.map((item, index) => (
              <tr
                key={item.id}
                onClick={() => onSelect?.(item)}
                className={`cursor-pointer text-sm text-cyan-50/75 transition hover:bg-cyan-100/5 ${
                  selectedId === item.id ? 'bg-cyan-400/10' : ''
                }`}
              >
                <td className="px-4 py-4 font-medium text-cyan-50/50">{index + 1}</td>
                <td className="px-4 py-4 font-medium text-white">{item.name}</td>
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
