function AiRiskExplainer({ item }) {
  if (!item) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-[#1E293B]/70 shadow-sm">
        Select an LGU or audit finding to generate a plain-language risk explanation.
      </div>
    )
  }

  const name = item.name || item.city || item.entity_id || 'Selected LGU'
  const score = typeof item.score === 'number' ? item.score.toFixed(2) : null
  const riskLevel = item.riskLevel || 'Medium'
  const drivers = [
    item.category,
    item.coaPattern,
    item.relatedReference ? `Reference: ${item.relatedReference}` : '',
  ].filter(Boolean)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/80">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#2563EB]">AI explainer placeholder</p>
          <h3 className="mt-1 text-base font-semibold text-[#0F172A]">{name}</h3>
        </div>
        <span className="rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-3 py-1 text-xs font-semibold text-[#2563EB]">
          {score ? `${score}/100` : riskLevel}
        </span>
      </div>

      <p className="text-sm leading-6 text-[#1E293B]/75">
        This LGU is currently flagged as {riskLevel}. The main concern is {item.details || item.recommendation || 'a pattern that needs reviewer attention'}.
      </p>

      {drivers.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {drivers.map((driver) => (
            <span key={driver} className="rounded-full bg-[#F8FAFC] px-3 py-1 text-xs text-[#1E293B]/70">
              {driver}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 rounded-lg border border-slate-200 bg-[#F8FAFC] p-3 text-xs leading-5 text-[#1E293B]/65">
        Free path: run a local model with Ollama, such as Llama 3.2 3B or Qwen2.5 3B, then send this LGU's score, factors, and audit findings to a local explanation endpoint.
      </div>
    </div>
  )
}

export default AiRiskExplainer
