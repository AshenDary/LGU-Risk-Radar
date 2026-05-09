import InfoBanner from '../common/InfoBanner'
import { getRiskLevelColor } from '../../utils/riskLevels'

function TopTrustworthyLGUs({ data }) {
  return (
    <div className="premium-card premium-hover reveal-on-scroll overflow-hidden rounded-3xl border border-[#38BDF8]/35 bg-white shadow-2xl shadow-[#2563EB]/12">
      <div className="flex items-center justify-between border-b border-[#38BDF8]/20 bg-gradient-to-r from-[#F8FAFC] via-white to-[#EFF6FF] px-8 py-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Ranking</p>
          <h3 className="mt-2 text-3xl font-black leading-tight text-[#0F172A]">Top 5 Most Trustworthy LGUs</h3>
        </div>
      </div>

      <div className="dashboard-scrollbar overflow-x-auto">
        <table className="min-w-[560px] table-fixed">
          <colgroup>
            <col className="w-[14%]" />
            <col className="w-[40%]" />
            <col className="w-[22%]" />
            <col className="w-[24%]" />
          </colgroup>
          <thead className="border-b border-[#38BDF8]/18 bg-[#F8FAFC]">
            <tr>
              <th className="px-3 py-4 text-left text-xs font-black uppercase tracking-[0.08em] text-slate-600 sm:px-6">Rank</th>
              <th className="px-3 py-4 text-left text-xs font-black uppercase tracking-[0.08em] text-slate-600 sm:px-6">LGU</th>
              <th className="px-3 py-4 text-left text-xs font-black uppercase tracking-[0.08em] text-slate-600 sm:px-6">Score</th>
              <th className="px-3 py-4 text-left text-xs font-black uppercase tracking-[0.08em] text-slate-600 sm:px-6">Level</th>
            </tr>
          </thead>
          <tbody>
            {data.map((lgu, index) => (
              <tr key={lgu.id} className="border-b border-[#38BDF8]/12 transition-colors duration-200 hover:bg-[#F8FAFC]">
                <td className="px-3 py-5 text-sm font-bold text-slate-700 sm:px-6">#{index + 1}</td>
                <td className="break-words px-3 py-5 text-sm font-semibold leading-5 text-[#0F172A] sm:px-6">{lgu.name}</td>
                <td className="break-words px-3 py-5 text-sm text-[#1E293B]/75 sm:px-6">{lgu.score.toFixed(2)}</td>
                <td className="px-3 py-5 text-sm sm:px-6">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: getRiskLevelColor(lgu.riskLevel) }}
                  >
                    {lgu.riskLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="border-t border-[#38BDF8]/18 bg-[#F8FAFC] px-8 py-5">
        <InfoBanner text="Lower risk scores indicate more trustworthy governance and procurement practices." />
      </div>
    </div>
  )
}

export default TopTrustworthyLGUs
