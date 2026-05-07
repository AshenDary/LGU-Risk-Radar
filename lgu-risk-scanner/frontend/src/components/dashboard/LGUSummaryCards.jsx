import Card from '../ui/Card'

function LGUSummaryCards({ summaryData }) {
  const summaryItems = [
    {
      label: 'Total LGUs',
      value: summaryData.totalLGUs.toLocaleString(),
      accent: 'bg-[#38BDF8]',
    },
    {
      label: 'High Risk',
      value: summaryData.highRisk.toLocaleString(),
      accent: 'bg-orange-400',
    },
    {
      label: 'Average Risk Score',
      value: summaryData.avgRisk,
      accent: 'bg-emerald-400',
    },
    {
      label: 'Critical LGUs',
      value: summaryData.critical.toLocaleString(),
      accent: 'bg-red-400',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {summaryItems.map((item) => (
        <Card key={item.label}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#1E293B]/65">{item.label}</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-[#0F172A]">{item.value}</p>
            </div>
            <span className={`mt-1 h-2.5 w-2.5 rounded-full ${item.accent}`} />
          </div>
        </Card>
      ))}
    </div>
  )
}

export default LGUSummaryCards
