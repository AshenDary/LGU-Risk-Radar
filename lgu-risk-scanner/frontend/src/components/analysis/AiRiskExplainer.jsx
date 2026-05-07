import { useEffect, useMemo, useState } from 'react'
import { askExplanationQuestion, generateAuditChecklist, generateExplanation } from '../../services/api'

const SCORE_BY_LEVEL = {
  Critical: 90,
  High: 80,
  Medium: 55,
  Low: 25,
}

const QUICK_QUESTIONS = [
  'Why is this risky?',
  'What should reviewers check next?',
  'Which factor matters most?',
  'How should this be escalated?',
]

function buildExplanationInput(item) {
  const name = item.name || item.city || item.entity_id || 'Selected LGU'
  const riskLevel = item.riskLevel || 'Medium'
  const riskScore = typeof item.score === 'number' ? item.score : SCORE_BY_LEVEL[riskLevel] || 55
  const factors = item.factors && Object.keys(item.factors).length > 0
    ? item.factors
    : {
        category: item.category,
        finding: item.details,
        recommendation: item.recommendation,
        coa_pattern: item.coaPattern,
        related_reference: item.relatedReference,
        amount: item.amount ? `PHP ${Number(item.amount).toLocaleString()}` : '',
      }

  return { name, riskLevel, riskScore, factors }
}

function compactFactors(factors) {
  return Object.entries(factors || {})
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .slice(0, 5)
}

function AiRiskExplainer({ item }) {
  const [explanationState, setExplanationState] = useState({
    loading: false,
    error: '',
    text: '',
    usedAi: false,
    fallbackReason: '',
    model: '',
  })
  const [answers, setAnswers] = useState([])
  const [question, setQuestion] = useState('')
  const [asking, setAsking] = useState(false)
  const [askError, setAskError] = useState('')
  const [checklistState, setChecklistState] = useState({ loading: false, text: '', error: '', fallbackReason: '' })
  const [drilldown, setDrilldown] = useState(null)
  const [refreshCount, setRefreshCount] = useState(0)

  const input = useMemo(() => (item ? buildExplanationInput(item) : null), [item])
  const inputKey = useMemo(() => (input ? JSON.stringify(input) : ''), [input])
  const factorEntries = useMemo(() => compactFactors(input?.factors), [input])

  useEffect(() => {
    setAnswers([])
    setQuestion('')
    setAskError('')
    setChecklistState({ loading: false, text: '', error: '', fallbackReason: '' })
    setDrilldown(null)
  }, [inputKey])

  useEffect(() => {
    if (!input) return

    let cancelled = false
    setExplanationState((current) => ({
      ...current,
      loading: true,
      error: '',
    }))

    generateExplanation(input.name, input.riskScore, input.riskLevel, input.factors)
      .then((result) => {
        if (cancelled) return
        setExplanationState({
          loading: false,
          error: '',
          text: result.explanation || 'No explanation was returned for this risk profile.',
          usedAi: Boolean(result.used_ai),
          fallbackReason: result.fallback_reason || '',
          model: result.model || '',
        })
      })
      .catch((error) => {
        if (cancelled) return
        setExplanationState({
          loading: false,
          error: error.message || 'Unable to generate the AI explanation.',
          text: '',
          usedAi: false,
          fallbackReason: '',
          model: '',
        })
      })

    return () => {
      cancelled = true
    }
  }, [inputKey, refreshCount])

  async function submitQuestion(nextQuestion) {
    const trimmedQuestion = nextQuestion.trim()
    if (!input || !trimmedQuestion || asking) return

    setAsking(true)
    setAskError('')

    try {
      const result = await askExplanationQuestion(
        input.name,
        input.riskScore,
        input.riskLevel,
        input.factors,
        trimmedQuestion
      )

      setAnswers((current) => [
        {
          id: `${Date.now()}-${trimmedQuestion}`,
          question: trimmedQuestion,
          answer: result.answer || 'No answer was returned for this question.',
          usedAi: Boolean(result.used_ai),
          fallbackReason: result.fallback_reason || '',
        },
        ...current,
      ].slice(0, 4))
      setQuestion('')
    } catch (error) {
      setAskError(error.message || 'Unable to answer that question.')
    } finally {
      setAsking(false)
    }
  }

  async function buildChecklist() {
    if (!input || checklistState.loading) return

    setChecklistState({ loading: true, text: '', error: '', fallbackReason: '' })
    try {
      const result = await generateAuditChecklist({
        name: input.name,
        riskScore: input.riskScore,
        riskLevel: input.riskLevel,
        factors: input.factors,
      })
      setChecklistState({
        loading: false,
        text: result.checklist || 'No checklist was returned.',
        error: '',
        fallbackReason: result.fallback_reason || '',
      })
    } catch (error) {
      setChecklistState({
        loading: false,
        text: '',
        error: error.message || 'Unable to generate checklist.',
        fallbackReason: '',
      })
    }
  }

  if (!item || !input) {
    return (
      <div className="rounded-lg border border-cyan-200/10 bg-[#0a2240] p-5 text-sm text-cyan-50/60">
        Select an LGU or audit finding to generate a plain-language risk explanation.
      </div>
    )
  }

  const score = input.riskScore.toFixed(2)

  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-cyan-300/20 bg-[#071f33] p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/60">
            {explanationState.usedAi ? 'AI risk assistant' : 'Risk assistant'}
          </p>
          <h3 className="mt-1 break-words text-base font-semibold text-white">{input.name}</h3>
          {explanationState.model && (
            <p className="mt-1 break-all text-xs text-cyan-50/45">{explanationState.model}</p>
          )}
        </div>
        <span className="shrink-0 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
          {score}/100
        </span>
      </div>

      <div className="min-w-0 rounded-md border border-cyan-200/10 bg-[#041726] p-3">
        {explanationState.loading ? (
          <p className="text-sm leading-6 text-cyan-50/60">Generating explanation...</p>
        ) : explanationState.error ? (
          <p className="break-words text-sm leading-6 text-red-100">{explanationState.error}</p>
        ) : (
          <>
            <p className="break-words text-sm leading-6 text-cyan-50/75">{explanationState.text}</p>
            {explanationState.fallbackReason && (
              <p className="mt-3 break-words text-xs leading-5 text-amber-100/70">
                Using fallback: {explanationState.fallbackReason}
              </p>
            )}
          </>
        )}
      </div>

      {factorEntries.length > 0 && (
        <div className="mt-4 grid gap-2">
          {factorEntries.map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => setDrilldown({ key, value })}
              className="grid min-h-10 min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded border border-cyan-200/10 bg-cyan-100/5 px-3 py-2 text-left text-xs text-cyan-50/70 transition hover:bg-cyan-100/10"
            >
              <span className="min-w-0 truncate font-semibold text-cyan-100">{key.replaceAll('_', ' ')}</span>
              <span className="max-w-24 truncate text-cyan-50/55">{String(value)}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={buildChecklist}
          disabled={checklistState.loading}
          className="min-h-10 rounded border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-semibold leading-4 text-emerald-50 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {checklistState.loading ? 'Building checklist...' : 'Create audit checklist'}
        </button>
        <button
          type="button"
          onClick={() => submitQuestion('Summarize the supporting evidence reviewers should inspect.')}
          disabled={asking}
          className="min-h-10 rounded border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-semibold leading-4 text-cyan-50 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Show supporting records
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {QUICK_QUESTIONS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => submitQuestion(prompt)}
            disabled={asking}
            className="min-h-10 whitespace-normal rounded border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-semibold leading-4 text-cyan-50 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form
        className="mt-4 grid gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          submitQuestion(question)
        }}
      >
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask a reviewer-style question"
          rows={3}
          className="resize-none rounded border border-cyan-200/10 bg-[#061a2b] px-3 py-2 text-sm leading-5 text-white outline-none placeholder:text-cyan-50/35 focus:border-cyan-300/40"
        />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setRefreshCount((count) => count + 1)}
            disabled={explanationState.loading}
            className="rounded border border-cyan-300/20 bg-transparent px-3 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Regenerate
          </button>
          <button
            type="submit"
            disabled={asking || !question.trim()}
            className="rounded border border-cyan-300/20 bg-cyan-300/15 px-3 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {asking ? 'Answering...' : 'Ask'}
          </button>
        </div>
      </form>

      {askError && (
          <p className="mt-3 break-words rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-100">
          {askError}
        </p>
      )}

      {(checklistState.text || checklistState.error) && (
        <div className="mt-4 min-w-0 rounded-md border border-emerald-300/15 bg-emerald-300/5 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200/70">Audit checklist</p>
          {checklistState.error ? (
            <p className="mt-2 break-words text-sm leading-6 text-red-100">{checklistState.error}</p>
          ) : (
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-cyan-50/75">{checklistState.text}</p>
          )}
          {checklistState.fallbackReason && (
            <p className="mt-2 break-words text-xs leading-5 text-amber-100/70">
              Using fallback: {checklistState.fallbackReason}
            </p>
          )}
        </div>
      )}

      {answers.length > 0 && (
        <div className="mt-4 grid gap-3">
          {answers.map((entry) => (
            <div key={entry.id} className="min-w-0 rounded-md border border-cyan-200/10 bg-[#041726] p-3">
              <p className="break-words text-xs font-semibold text-cyan-100">{entry.question}</p>
              <p className="mt-2 break-words text-sm leading-6 text-cyan-50/75">{entry.answer}</p>
              {entry.fallbackReason && (
                <p className="mt-2 break-words text-xs leading-5 text-amber-100/70">
                  Using fallback: {entry.fallbackReason}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {drilldown && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setDrilldown(null)}>
          <div
            className="w-full max-w-lg rounded-lg border border-cyan-200/15 bg-[#071f33] p-5 shadow-xl shadow-black/40"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/60">Risk factor drill-down</p>
                <h4 className="mt-1 break-words text-lg font-semibold text-white">
                  {drilldown.key.replaceAll('_', ' ')}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setDrilldown(null)}
                className="rounded border border-cyan-200/10 px-3 py-1 text-sm text-cyan-50/70 hover:bg-cyan-100/10"
              >
                Close
              </button>
            </div>
            <div className="mt-4 rounded-md border border-cyan-200/10 bg-[#041726] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/60">Current value</p>
              <p className="mt-2 break-words text-sm leading-6 text-cyan-50/80">{String(drilldown.value)}</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-cyan-50/70">
              Use this factor as a review entry point. Inspect the source records connected to the selected LGU, confirm whether the value reflects a real pattern, and compare it with other factors before escalating.
            </p>
            <button
              type="button"
              onClick={() => {
                submitQuestion(`Explain the ${drilldown.key.replaceAll('_', ' ')} factor.`)
                setDrilldown(null)
              }}
              className="mt-4 w-full rounded border border-cyan-300/20 bg-cyan-300/15 px-3 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
            >
              Ask assistant about this factor
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AiRiskExplainer
