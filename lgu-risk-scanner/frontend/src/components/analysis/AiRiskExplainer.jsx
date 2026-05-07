function AiRiskExplainer({ item }) {
  if (!item) {
    return (
      <div className="rounded-lg border border-cyan-200/10 bg-[#0a2240] p-5 text-sm text-cyan-50/60">
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
    <div className="rounded-lg border border-cyan-300/20 bg-[#071f33] p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/60">AI explainer placeholder</p>
          <h3 className="mt-1 text-base font-semibold text-white">{name}</h3>
        </div>
        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
          {score ? `${score}/100` : riskLevel}
        </span>
      </div>

      <p className="text-sm leading-6 text-cyan-50/75">
        This LGU is currently flagged as {riskLevel}. The main concern is {item.details || item.recommendation || 'a pattern that needs reviewer attention'}.
      </p>

      {drivers.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {drivers.map((driver) => (
            <span key={driver} className="rounded-full bg-cyan-100/10 px-3 py-1 text-xs text-cyan-50/70">
              {driver}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 rounded-md border border-cyan-200/10 bg-[#041726] p-3 text-xs leading-5 text-cyan-50/60">
        Free path: run a local model with Ollama, such as Llama 3.2 3B or Qwen2.5 3B, then send this LGU's score, factors, and audit findings to a local explanation endpoint.
      </div>
    </div>
  )
}

export default AiRiskExplainer
