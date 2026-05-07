import { useMemo, useState } from 'react'
import InfoBanner from '../components/common/InfoBanner'
import PageHeader from '../components/common/PageHeader'
import DashboardLayout from '../components/layout/DashboardLayout'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useRiskData } from '../hooks/useRiskData'
import { generateRiskReport } from '../services/api'

export default function ReportsPage() {
  const { loading, error, lguRiskRows, auditRows } = useRiskData()
  const sortedRows = useMemo(() => [...lguRiskRows].sort((a, b) => b.score - a.score), [lguRiskRows])
  const [title, setTitle] = useState('NCR LGU Risk Review Report')
  const [notes, setNotes] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [reportState, setReportState] = useState({ loading: false, text: '', error: '', fallbackReason: '', usedAi: false })

  const selectedProfiles = sortedRows
    .filter((row) => selectedIds.includes(row.id))
    .map((row) => ({
      ...row,
      auditFindings: auditRows.filter((audit) => audit.entityId === row.id).slice(0, 5),
    }))

  function toggleSelected(id) {
    setSelectedIds((current) => (
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id].slice(0, 6)
    ))
  }

  async function buildReport() {
    if (!selectedProfiles.length) return
    setReportState({ loading: true, text: '', error: '', fallbackReason: '', usedAi: false })

    try {
      const response = await generateRiskReport(title, selectedProfiles, notes)
      setReportState({
        loading: false,
        text: response.report || 'No report was returned.',
        error: '',
        fallbackReason: response.fallback_reason || '',
        usedAi: Boolean(response.used_ai),
      })
    } catch (error) {
      setReportState({
        loading: false,
        text: '',
        error: error.message || 'Unable to generate report.',
        fallbackReason: '',
        usedAi: false,
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <PageHeader title="Reports" description="Build AI-assisted audit risk reports from selected LGUs." />

        <InfoBanner text="Select up to six LGUs, add reviewer notes, then generate a structured report section that can be refined for documentation." />

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
          <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
            <div className="grid content-start gap-6">
              <Card>
                <div className="grid gap-4">
                  <label className="grid gap-2 text-sm text-cyan-50/70">
                    Report title
                    <input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      className="rounded border border-cyan-200/10 bg-[#061a2b] px-3 py-2 text-sm text-white outline-none"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-cyan-50/70">
                    Reviewer notes
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      rows={5}
                      placeholder="Add scope, assumptions, or meeting notes"
                      className="resize-none rounded border border-cyan-200/10 bg-[#061a2b] px-3 py-2 text-sm text-white outline-none placeholder:text-cyan-50/35"
                    />
                  </label>
                  <Button onClick={buildReport} disabled={reportState.loading || !selectedProfiles.length}>
                    {reportState.loading ? 'Generating...' : 'Generate report'}
                  </Button>
                </div>
              </Card>

              <Card>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-white">Selected LGUs</h2>
                  <Badge>{selectedProfiles.length}/6</Badge>
                </div>
                <div className="grid max-h-[460px] gap-2 overflow-y-auto pr-1">
                  {sortedRows.map((row) => {
                    const active = selectedIds.includes(row.id)
                    return (
                      <button
                        key={row.id}
                        type="button"
                        onClick={() => toggleSelected(row.id)}
                        className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded border px-3 py-2 text-left text-sm transition ${
                          active
                            ? 'border-cyan-300/40 bg-cyan-300/10 text-white'
                            : 'border-cyan-200/10 bg-cyan-100/5 text-cyan-50/70 hover:bg-cyan-100/10'
                        }`}
                      >
                        <span className="truncate">{row.name}</span>
                        <span className="font-semibold">{row.score.toFixed(1)}</span>
                      </button>
                    )
                  })}
                </div>
              </Card>
            </div>

            <Card className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-white">Generated Report</h2>
                {reportState.usedAi && <Badge variant="success">AI generated</Badge>}
              </div>

              {!reportState.text && !reportState.error && !reportState.loading && (
                <div className="mt-5 rounded border border-cyan-200/10 bg-[#071f33] p-5 text-sm leading-6 text-cyan-50/60">
                  Choose LGUs and generate a report. The report will appear here with sections ready for review.
                </div>
              )}

              {reportState.loading && (
                <div className="mt-5 rounded border border-cyan-200/10 bg-[#071f33] p-5 text-sm text-cyan-50/60">
                  Drafting report...
                </div>
              )}

              {reportState.error && (
                <p className="mt-5 break-words rounded border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                  {reportState.error}
                </p>
              )}

              {reportState.text && (
                <div className="mt-5 whitespace-pre-wrap break-words rounded border border-cyan-200/10 bg-[#071f33] p-5 text-sm leading-7 text-cyan-50/80">
                  {reportState.text}
                </div>
              )}

              {reportState.fallbackReason && (
                <p className="mt-3 text-xs text-amber-100/70">Using fallback: {reportState.fallbackReason}</p>
              )}
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
