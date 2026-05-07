import Card from '../ui/Card'

function LGUSummaryCards({ summaryData }) {
  const summaryItems = [
    {
      label: 'Total LGUs',
      value: summaryData.totalLGUs.toLocaleString(),
      accent: 'bg-[#2563EB]',
    },
    {
      label: 'High Risk',
      value: summaryData.highRisk.toLocaleString(),
      accent: 'bg-orange-500',
    },
    {
      label: 'Average Risk Score',
      value: summaryData.avgRisk,
      accent: 'bg-emerald-500',
    },
    {
      label: 'Critical LGUs',
      value: summaryData.critical.toLocaleString(),
      accent: 'bg-red-600',
    },
  ]

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {summaryItems.map((item) => (
        <Card key={item.label}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-base font-semibold text-[#2563EB]">{item.label}</p>
              <p className="mt-4 text-4xl font-extrabold tracking-tight text-[#0F172A]">{item.value}</p>
              <p className="mt-2 text-xs font-medium text-[#475569]">Live dashboard metric</p>
            </div>
            <span className={`mt-1 h-2.5 w-2.5 rounded-full ${item.accent}`} />
          </div>
        </Card>
      ))}
    </div>
  )
}

export default LGUSummaryCards
