import { useMemo, useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import DropdownSelect from '../components/ui/DropdownSelect'
import MarkdownText from '../components/common/MarkdownText'
import { useRiskData } from '../hooks/useRiskData'
import { compareLGUProfiles } from '../services/api'
import { getRiskBadgeClass } from '../utils/riskLevels'

function ProfileCard({ lgu }) {
  if (!lgu) return null

  const factorRows = Object.entries(lgu.factors || {}).slice(0, 5)

  return (
    <Card className="min-w-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">LGU profile</p>
          <h2 className="mt-2 break-words text-2xl font-black text-[#0F172A]">{lgu.name}</h2>
          <p className="mt-1 text-sm font-medium text-[#2563EB]">{lgu.location || 'NCR city'}</p>
        </div>
        <Badge className={getRiskBadgeClass(lgu.riskLevel, lgu.score)}>{lgu.riskLevel}</Badge>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#38BDF8]/25 bg-[#EFF6FF] p-4">
          <p className="text-xs font-bold text-[#2563EB]">Risk score</p>
          <p className="mt-2 text-3xl font-extrabold text-[#0F172A]">{lgu.score.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border border-[#38BDF8]/25 bg-[#EFF6FF] p-4">
          <p className="text-xs font-bold text-[#2563EB]">Procurements</p>
          <p className="mt-2 text-3xl font-extrabold text-[#0F172A]">{lgu.procurementCount}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {factorRows.map(([key, value]) => (
          <div key={key} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-xl border border-[#38BDF8]/20 bg-white px-3 py-2 text-sm shadow-sm">
            <span className="truncate font-medium text-slate-600">{key.replaceAll('_', ' ')}</span>
            <span className="font-semibold text-[#0F172A]">{String(value)}</span>
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
    <DashboardLayout
      title="Compare LGUs"
      description="Compare cities across risk score, procurement exposure, and scoring factors."
    >
      <div className="grid gap-8">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex w-full items-center justify-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 py-4 text-sm font-medium text-blue-600 transition-all duration-500">
            <div className="h-5 w-5 rounded-full border-2 border-blue-500/40 border-t-blue-600 animate-spin" />
            <span className="animate-pulse">Analyzing live LGU data...</span>
          </div>
        ) : (
          <>
            <Card className="dropdown-card relative">
              <div className="mb-5 max-w-2xl">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Comparison setup</p>
                <h2 className="mt-2 text-3xl font-black leading-tight text-[#0F172A]">Select LGUs to Compare</h2>
                <p className="mt-2 text-sm font-medium leading-6 text-[#2563EB]">Choose two cities to compare risk score, exposure, and scoring factors.</p>
              </div>
              <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
                <DropdownSelect
                  value={left?.id || ''}
                  options={sortedRows}
                  onChange={setLeftId}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  placeholder="Select LGU"
                />
                <DropdownSelect
                  value={right?.id || ''}
                  options={sortedRows}
                  onChange={setRightId}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  placeholder="Select LGU"
                />
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
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Comparison</p>
                    <h2 className="mt-2 text-2xl font-black text-[#0F172A]">AI Comparison</h2>
                  </div>
                  {result.usedAi && <Badge variant="success">AI generated</Badge>}
                </div>
                {result.loading ? (
                  <p className="mt-5 rounded-2xl border border-[#38BDF8]/30 bg-[#EFF6FF] p-4 text-sm font-medium text-[#2563EB]">Generating comparison...</p>
                ) : result.error ? (
                  <p className="mt-5 break-words rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{result.error}</p>
                ) : (
                  <MarkdownText text={result.text} className="mt-5 break-words rounded-2xl border border-[#38BDF8]/30 bg-[#EFF6FF] p-4 text-sm font-medium leading-6 text-[#0F172A]" />
                )}
                {result.fallbackReason && (
                  <p className="mt-3 text-xs text-amber-700">Using fallback: {result.fallbackReason}</p>
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
