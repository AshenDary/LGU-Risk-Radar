import { useMemo, useState } from 'react'
import InfoBanner from '../components/common/InfoBanner'
import PageHeader from '../components/common/PageHeader'
import DashboardLayout from '../components/layout/DashboardLayout'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useRiskData } from '../hooks/useRiskData'
import { compareLGUProfiles } from '../services/api'

const riskVariant = {
  Critical: 'danger',
  High: 'danger',
  Medium: 'warning',
  Low: 'success',
}

function ProfileCard({ lgu }) {
  if (!lgu) return null

  const factorRows = Object.entries(lgu.factors || {}).slice(0, 5)

  return (
    <Card className="min-w-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="break-words text-lg font-semibold text-white">{lgu.name}</h2>
          <p className="mt-1 text-sm text-cyan-50/55">{lgu.location || 'NCR city'}</p>
        </div>
        <Badge variant={riskVariant[lgu.riskLevel] || 'default'}>{lgu.riskLevel}</Badge>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded border border-cyan-200/10 bg-[#071f33] p-3">
          <p className="text-xs text-cyan-50/45">Risk score</p>
          <p className="mt-1 text-2xl font-semibold text-white">{lgu.score.toFixed(2)}</p>
        </div>
        <div className="rounded border border-cyan-200/10 bg-[#071f33] p-3">
          <p className="text-xs text-cyan-50/45">Procurements</p>
          <p className="mt-1 text-2xl font-semibold text-white">{lgu.procurementCount}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-2">
        {factorRows.map(([key, value]) => (
          <div key={key} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 text-sm">
            <span className="truncate text-cyan-50/55">{key.replaceAll('_', ' ')}</span>
            <span className="font-semibold text-cyan-50/85">{String(value)}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function CompareLGUsPage() {
  const { loading, error, lguRiskRows } = useRiskData()
  const sortedRows = useMemo(() => [...lguRiskRows].sort((a, b) => b.score - a.score), [lguRiskRows])
  const [leftId, setLeftId] = useState('')
  const [rightId, setRightId] = useState('')
  const [result, setResult] = useState({ loading: false, text: '', error: '', fallbackReason: '', usedAi: false })

  const left = sortedRows.find((row) => row.id === leftId) || sortedRows[0]
  const right = sortedRows.find((row) => row.id === rightId) || sortedRows.find((row) => row.id !== left?.id)

  async function runComparison() {
    if (!left || !right) return
    setResult({ loading: true, text: '', error: '', fallbackReason: '', usedAi: false })

    try {
      const response = await compareLGUProfiles(left, right)
      setResult({
        loading: false,
        text: response.comparison || 'No comparison was returned.',
        error: '',
        fallbackReason: response.fallback_reason || '',
        usedAi: Boolean(response.used_ai),
      })
    } catch (error) {
      setResult({
        loading: false,
        text: '',
        error: error.message || 'Unable to compare LGUs.',
        fallbackReason: '',
        usedAi: false,
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <PageHeader
          title="Compare LGUs"
          description="Compare cities across risk score, procurement exposure, and scoring factors."
        />

        <InfoBanner text="Select two LGUs and generate an evidence-aware AI comparison. The output is a review aid, not a finding of wrongdoing." />

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-cyan-200/10 bg-[#0f2e47] p-6 text-sm text-cyan-50/70">
            Loading live backend data...
          </div>
        ) : (
          <>
            <Card>
              <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
                <select
                  value={left?.id || ''}
                  onChange={(event) => setLeftId(event.target.value)}
                  className="rounded border border-cyan-200/10 bg-[#061a2b] px-3 py-2 text-sm text-white outline-none"
                >
                  {sortedRows.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                <select
                  value={right?.id || ''}
                  onChange={(event) => setRightId(event.target.value)}
                  className="rounded border border-cyan-200/10 bg-[#061a2b] px-3 py-2 text-sm text-white outline-none"
                >
                  {sortedRows.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                <Button onClick={runComparison} disabled={result.loading || !left || !right || left.id === right.id}>
                  {result.loading ? 'Comparing...' : 'Compare with AI'}
                </Button>
              </div>
            </Card>

            <div className="grid min-w-0 gap-6 lg:grid-cols-2">
              <ProfileCard lgu={left} />
              <ProfileCard lgu={right} />
            </div>

            {(result.text || result.error || result.loading) && (
              <Card>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-white">AI Comparison</h2>
                  {result.usedAi && <Badge variant="success">AI generated</Badge>}
                </div>
                {result.loading ? (
                  <p className="mt-4 text-sm text-cyan-50/60">Generating comparison...</p>
                ) : result.error ? (
                  <p className="mt-4 break-words text-sm text-red-100">{result.error}</p>
                ) : (
                  <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-cyan-50/75">{result.text}</p>
                )}
                {result.fallbackReason && (
                  <p className="mt-3 text-xs text-amber-100/70">Using fallback: {result.fallbackReason}</p>
                )}
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default CompareLGUsPage
