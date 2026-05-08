import { useEffect, useMemo, useState } from 'react'
import { askExplanationQuestion, generateExplanation } from '../../services/api'
import MarkdownText from '../common/MarkdownText'

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
  const [isAskOpen, setIsAskOpen] = useState(false)

  const input = useMemo(() => (item ? buildExplanationInput(item) : null), [item])
  const inputKey = useMemo(() => (input ? JSON.stringify(input) : ''), [input])

  useEffect(() => {
    setAnswers([])
    setQuestion('')
    setAskError('')
    setIsAskOpen(false)
    setExplanationState({
      loading: false,
      error: '',
      text: '',
      usedAi: false,
      fallbackReason: '',
      model: '',
    })
  }, [inputKey])

  async function handleGenerateExplanation() {
    if (!input || explanationState.loading) return

    setExplanationState({
      loading: true,
      error: '',
      text: '',
      usedAi: false,
      fallbackReason: '',
      model: '',
    })

    try {
      const result = await generateExplanation(input.name, input.riskScore, input.riskLevel, input.factors)
      setExplanationState({
        loading: false,
        error: '',
        text: result.explanation || 'No explanation was returned for this risk profile.',
        usedAi: Boolean(result.used_ai),
        fallbackReason: result.fallback_reason || '',
        model: result.model || '',
      })
    } catch (error) {
      setExplanationState({
        loading: false,
        error: error.message || 'Unable to generate the AI explanation.',
        text: '',
        usedAi: false,
        fallbackReason: '',
        model: '',
      })
    }
  }

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

  if (!item || !input) {
    return (
      <div className="min-w-0 rounded-2xl bg-white p-6 sm:p-7 text-[#0F172A] border border-[#38BDF8]/30">
        Select an LGU or audit finding to generate a plain-language risk explanation.
      </div>
    )
  }

  const score = input.riskScore.toFixed(2)

  return (
    <div className="min-w-0 bg-white border border-[#38BDF8]/30">
      <div className="p-6 sm:p-7">
        <div className="mb-6 flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">
            {explanationState.usedAi ? 'AI risk assistant' : 'Risk assistant'}
          </p>
          <h3 className="mt-2 break-words text-2xl font-black text-[#0F172A]">{input.name}</h3>
          {explanationState.model && (
            <p className="mt-1 break-all text-xs text-slate-500">{explanationState.model}</p>
          )}
        </div>
        <span className="shrink-0 rounded-full border border-[#38BDF8]/45 bg-[#EFF6FF] px-3 py-1 text-xs font-black text-[#2563EB]">
          {score}/100
        </span>
      </div>

      <div className="min-h-0 min-w-0 rounded-2xl border border-[#38BDF8]/30 bg-[#EFF6FF] p-4">
        {explanationState.loading ? (
          <p className="text-sm leading-6 text-[#2563EB]">Generating explanation...</p>
        ) : explanationState.error ? (
          <p className="break-words text-sm leading-6 text-red-600">{explanationState.error}</p>
        ) : explanationState.text ? (
          <>
            <div className="ai-assistant-copy dashboard-scrollbar pr-2">
              <MarkdownText text={explanationState.text} className="break-words text-sm font-medium leading-6 text-[#0F172A]" />
            </div>
            {explanationState.fallbackReason && (
              <p className="mt-3 break-words text-xs leading-5 text-amber-700">
                Using fallback: {explanationState.fallbackReason}
              </p>
            )}
          </>
        ) : (
          <p className="text-sm font-medium leading-6 text-[#2563EB]">
            Generate an explanation when you are ready to review this risk profile.
          </p>
        )}
      </div>

      <div className="mt-5 grid shrink-0 gap-2">
        <button
          type="button"
          onClick={handleGenerateExplanation}
          disabled={explanationState.loading}
          className="min-h-10 rounded-xl border border-[#2563EB]/35 bg-[#2563EB] px-3 py-2 text-xs font-bold leading-4 text-white transition hover:bg-[#0F172A] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {explanationState.loading ? 'Generating...' : explanationState.text ? 'Regenerate explanation' : 'Generate explanation'}
        </button>
        <button
          type="button"
          onClick={() => setIsAskOpen(true)}
          className="min-h-10 rounded-xl border border-[#38BDF8]/35 bg-[#EFF6FF] px-3 py-2 text-xs font-bold leading-4 text-[#2563EB] transition hover:border-[#2563EB]/50 hover:bg-[#DBEAFE]"
        >
          Ask assistant
        </button>
      </div>

      {isAskOpen ? (
        <div className="modal-overlay-in fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-lg" onClick={() => setIsAskOpen(false)}>
          <div
            className="modal-pop-in dashboard-scrollbar w-full overflow-y-auto rounded-3xl border border-[#38BDF8]/35 bg-white p-6 shadow-2xl shadow-[#0F172A]/20 sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-5">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">AI risk assistant</p>
                <h4 className="mt-2 break-words text-xl font-black text-[#0F172A]">Ask about {input.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAskOpen(false)}
                aria-label="Close assistant"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#38BDF8]/30 text-xl font-bold leading-none text-[#2563EB] hover:bg-[#EFF6FF]"
              >
                x
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => submitQuestion('Summarize the supporting evidence reviewers should inspect.')}
                disabled={asking}
                className="rounded-full border border-[#38BDF8]/30 bg-white px-4 py-2 text-xs font-bold leading-5 text-[#0F172A] shadow-sm transition hover:bg-[#F8FAFC] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Show supporting records
              </button>
              {QUICK_QUESTIONS.slice(0, 3).map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => submitQuestion(prompt)}
                disabled={asking}
                className="rounded-full border border-[#38BDF8]/30 bg-white px-4 py-2 text-xs font-bold leading-5 text-[#0F172A] shadow-sm transition hover:bg-[#F8FAFC] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {prompt}
              </button>
              ))}
            </div>

          <form
            className="mt-5 grid gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              submitQuestion(question)
            }}
          >
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask a reviewer-style question"
              rows={5}
              className="resize-none rounded-xl border border-[#38BDF8]/30 bg-white px-4 py-3 text-sm leading-6 text-[#0F172A] outline-none placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-[#38BDF8]/15"
            />
            <div className="grid gap-3">
              <button
                type="submit"
                disabled={asking || !question.trim()}
                className="rounded-xl border border-[#38BDF8]/35 bg-[#EFF6FF] px-4 py-3 text-sm font-bold text-[#2563EB] transition hover:bg-[#DBEAFE] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {asking ? 'Answering...' : 'Ask'}
              </button>
            </div>
          </form>

            {answers.length > 0 && (
              <div className="dashboard-scrollbar mt-5 max-h-96 overflow-y-auto rounded-2xl border border-[#38BDF8]/25 bg-[#F8FAFC] p-3">
                <div className="grid gap-3">
                  {answers.map((entry) => (
                    <div key={entry.id} className="min-w-0 rounded-2xl border border-[#38BDF8]/25 bg-white p-4 shadow-sm">
                      <p className="break-words text-xs font-bold text-[#2563EB]">{entry.question}</p>
                      <p className="mt-2 break-words text-sm leading-6 text-[#0F172A]">{entry.answer}</p>
                      {entry.fallbackReason && (
                        <p className="mt-2 break-words text-xs leading-5 text-amber-700">
                          Using fallback: {entry.fallbackReason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {askError && (
          <p className="mt-3 break-words rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">
          {askError}
        </p>
      )}

      {answers.length > 0 && !isAskOpen && (
        <div className="dashboard-scrollbar mt-4 grid max-h-32 shrink overflow-y-auto pr-2">
          {answers.map((entry) => (
            <div key={entry.id} className="min-w-0 rounded-2xl border border-[#38BDF8]/25 bg-white p-4 shadow-sm">
              <p className="break-words text-xs font-bold text-[#2563EB]">{entry.question}</p>
              <p className="mt-2 break-words text-sm leading-6 text-[#0F172A]">{entry.answer}</p>
              {entry.fallbackReason && (
                <p className="mt-2 break-words text-xs leading-5 text-amber-700">
                  Using fallback: {entry.fallbackReason}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      </div>
    </div>
  )
}

export default AiRiskExplainer
