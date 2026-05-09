import { useMemo, useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import MarkdownText from '../components/common/MarkdownText'
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
    <DashboardLayout
      title="Reports"
      description="Build AI-assisted audit risk reports from selected LGUs."
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
          <div className="grid min-w-0 gap-8">
            <div className="grid min-w-0 items-stretch gap-8 xl:grid-cols-2">
              <Card className="min-w-0 xl:h-[500px]">
                <div className="flex h-full min-w-0 flex-col">
                  <div className="mb-5 max-w-2xl">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Report setup</p>
                    <h2 className="mt-2 text-3xl font-black leading-tight text-[#0F172A]">Build Risk Report</h2>
                    <p className="mt-2 text-sm font-medium leading-6 text-[#2563EB]">Select LGUs, add reviewer context, and generate an audit-ready draft.</p>
                  </div>

                  <label className="grid gap-2 text-sm font-bold text-[#0F172A]">
                    <span>Report title</span>
                    <input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      className="min-h-12 rounded-2xl border border-[#38BDF8]/35 bg-gradient-to-r from-white via-[#F8FAFC] to-[#EFF6FF] px-4 py-3 text-sm font-medium text-[#0F172A] shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-[#38BDF8]/15"
                    />
                  </label>

                  <label className="mt-4 grid min-h-0 flex-1 gap-2 text-sm font-bold text-[#0F172A]">
                    <span>Reviewer notes</span>
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      rows={4}
                      placeholder="Add scope, assumptions, or meeting notes"
                      className="min-h-0 resize-none rounded-2xl border border-[#38BDF8]/35 bg-white px-4 py-3 text-sm font-medium leading-6 text-[#0F172A] shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-[#38BDF8]/15 xl:h-full"
                    />
                  </label>

                  <Button
                    onClick={buildReport}
                    disabled={reportState.loading || !selectedProfiles.length}
                    className="mt-4 min-h-12 w-full shrink-0 rounded-2xl"
                  >
                    {reportState.loading ? 'Generating...' : 'Generate report'}
                  </Button>
                </div>
              </Card>

              <Card className="flex min-w-0 flex-col xl:h-[500px]">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Profiles</p>
                    <h2 className="mt-2 text-2xl font-black text-[#0F172A]">Selected LGUs</h2>
                  </div>
                  <Badge>{selectedProfiles.length}/6</Badge>
                </div>
                <div className="mb-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-[#38BDF8]/25 bg-[#EFF6FF] p-4">
                    <p className="text-xs font-bold text-[#2563EB]">Selected</p>
                    <p className="mt-2 text-3xl font-extrabold text-[#0F172A]">{selectedProfiles.length}/6</p>
                  </div>
                  <div className="rounded-2xl border border-[#38BDF8]/25 bg-[#EFF6FF] p-4">
                    <p className="text-xs font-bold text-[#2563EB]">Findings</p>
                    <p className="mt-2 text-3xl font-extrabold text-[#0F172A]">
                      {selectedProfiles.reduce((sum, profile) => sum + profile.auditFindings.length, 0)}
                    </p>
                  </div>
                </div>
                <div className="dashboard-scrollbar grid gap-3 overflow-y-auto pr-1 xl:min-h-0 xl:flex-1">
                  {sortedRows.map((row) => {
                    const active = selectedIds.includes(row.id)
                    return (
                      <button
                        key={row.id}
                        type="button"
                        onClick={() => toggleSelected(row.id)}
                        className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm shadow-sm transition ${
                          active
                            ? 'border-[#2563EB]/45 bg-[#EFF6FF] text-[#0F172A] shadow-[#2563EB]/10'
                            : 'border-[#38BDF8]/20 bg-white text-slate-700 hover:border-[#2563EB]/45 hover:bg-[#F8FAFC] hover:text-[#2563EB]'
                        }`}
                      >
                        <span className="truncate font-semibold">{row.name}</span>
                        <span className="rounded-full bg-[#F8FAFC] px-3 py-1 text-xs font-black text-[#0F172A] ring-1 ring-[#38BDF8]/20">
                          {row.score.toFixed(1)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </Card>
            </div>

            <Card className="min-w-0">
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Output</p>
                  <h2 className="mt-2 break-words text-3xl font-black leading-tight text-[#0F172A]">Generated Report</h2>
                </div>
                {reportState.usedAi && <Badge variant="success">AI generated</Badge>}
              </div>

              {!reportState.text && !reportState.error && !reportState.loading && (
                <div className="mt-4 rounded-2xl border border-[#38BDF8]/30 bg-[#EFF6FF] p-4 text-center text-xs font-semibold leading-5 text-[#2563EB]">
                  Choose LGUs and generate a report. The report will appear here with sections ready for review.
                </div>
              )}

              {reportState.loading && (
                <div className="mt-6 grid min-h-[360px] place-items-center rounded-2xl border border-[#38BDF8]/30 bg-[#EFF6FF] p-6 text-sm font-medium text-[#2563EB]">
                  Drafting report...
                </div>
              )}

              {reportState.error && (
                <p className="mt-6 break-words rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {reportState.error}
                </p>
              )}

              {reportState.text && (
                <MarkdownText
                  text={reportState.text}
                  className="mt-6 min-h-[360px] break-words rounded-2xl border border-[#38BDF8]/25 bg-white p-5 text-sm font-medium leading-7 text-[#0F172A] shadow-inner shadow-[#2563EB]/5"
                />
              )}

              {reportState.fallbackReason && (
                <p className="mt-3 text-xs text-amber-700">Using fallback: {reportState.fallbackReason}</p>
              )}
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
