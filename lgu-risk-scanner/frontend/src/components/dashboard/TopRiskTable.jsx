import Badge from '../ui/Badge'
import Card from '../ui/Card'
import { getRiskBadgeClass } from '../../utils/riskLevels'

function TopRiskTable({ rows, selectedId, onSelect }) {
  const visibleRows = rows.slice(0, 5)

  return (
    <Card className="overflow-hidden p-0">
      <div className="px-6 py-5 sm:px-8 sm:py-6">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Ranking</p>
          <h2 className="mt-2 text-3xl font-black leading-tight text-[#0F172A]">Top Risk LGUs</h2>
          <p className="mt-2 text-sm font-medium leading-6 text-[#2563EB]">Highest ranked LGUs by current risk score</p>
        </div>
      </div>

      <div className="dashboard-scrollbar overflow-x-auto px-3 pb-5 sm:px-5">
        <table className="min-w-[560px] table-fixed text-left">
          <colgroup>
            <col className="w-[15%]" />
            <col className="w-[41%]" />
            <col className="w-[20%]" />
            <col className="w-[24%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-[#38BDF8]/18 bg-transparent text-xs uppercase tracking-[0.14em] text-slate-600">
              <th className="px-2 py-4 font-black sm:px-4">Rank</th>
              <th className="px-2 py-4 font-black sm:px-4">LGU</th>
              <th className="px-2 py-4 font-black sm:px-4">Score</th>
              <th className="px-2 py-4 font-black sm:px-4">Level</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((item, index) => (
              <tr
                key={item.id}
                onClick={() => onSelect?.(item)}
                className="group cursor-pointer text-sm text-[#1E293B]/75"
              >
                <td className={`rounded-l-2xl px-2 py-5 font-bold text-[#2563EB] transition group-hover:bg-[#F8FAFC] sm:px-4 ${
                  selectedId === item.id ? 'bg-[#EFF6FF]' : ''
                }`}>
                  #{index + 1}
                </td>
                <td className={`break-words px-2 py-5 font-semibold leading-5 text-[#0F172A] transition group-hover:bg-[#F8FAFC] sm:px-4 ${
                  selectedId === item.id ? 'bg-[#EFF6FF]' : ''
                }`}>
                  {item.name}
                </td>
                <td className={`break-words px-2 py-5 font-semibold transition group-hover:bg-[#F8FAFC] sm:px-4 ${
                  selectedId === item.id ? 'bg-[#EFF6FF]' : ''
                }`}>
                  {item.score.toFixed(2)}
                </td>
                <td className={`rounded-r-2xl px-2 py-5 transition group-hover:bg-[#F8FAFC] sm:px-4 ${
                  selectedId === item.id ? 'bg-[#EFF6FF]' : ''
                }`}>
                  <Badge className={getRiskBadgeClass(item.riskLevel, item.score)}>{item.riskLevel}</Badge>
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
