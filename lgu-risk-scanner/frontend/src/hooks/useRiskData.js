import { useEffect, useMemo, useState } from 'react'
import { fetchAudits, fetchLGUs, fetchProcurements, fetchRiskScores } from '../services/api'
import { getRiskLevelLabel, normalizeRiskLevel } from '../utils/riskLevels'

let cachedRiskData = null
let pendingRiskData = null

function formatDetails(details) {
  if (!details || Object.keys(details).length === 0) return 'No additional details'
  if (details.finding) return details.finding
  return Object.entries(details)
    .map(([key, value]) => `${key.replaceAll('_', ' ')}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
    .join(', ')
}

function cleanLguName(value) {
  if (!value) return 'Unknown LGU'
  return `${value}`
    .replace(/^ncr[-_\s]*/i, '')
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

export function useRiskData() {
  const [state, setState] = useState({
    loading: !cachedRiskData,
    error: '',
    lguRiskRows: cachedRiskData?.lguRiskRows || [],
    procurements: cachedRiskData?.procurements || [],
    audits: cachedRiskData?.audits || [],
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        if (!pendingRiskData) {
          pendingRiskData = Promise.all([
            fetchLGUs(),
            fetchProcurements(),
            fetchAudits(),
            fetchRiskScores(),
          ]).then(([allLgus, allProcurements, allAudits, riskScores]) => {
            const lgus = allLgus.filter((lgu) => lgu.id?.startsWith('ncr-') && lgu.metadata?.lgu_type === 'city')
            const lguIds = new Set(lgus.map((lgu) => lgu.id))
            const procurements = allProcurements.filter((item) => lguIds.has(item.lgu_id))
            const audits = allAudits.filter((entry) => lguIds.has(entry.entity_id))
            const riskScoreByLgu = new Map(riskScores.map((score) => [score.lgu_id, score]))

            const lguRiskRows = lgus.map((lgu) => {
              const riskScore = riskScoreByLgu.get(lgu.id)
              const lguProcurements = procurements.filter((item) => item.lgu_id === lgu.id)
              const score = Number(riskScore?.score ?? 0)
              const riskLevel = normalizeRiskLevel(riskScore?.risk_level, score)
              const totalAmount = lguProcurements.reduce((sum, item) => sum + Number(item.amount || 0), 0)

              return {
                id: lgu.id,
                name: lgu.name,
                location: lgu.location,
                population: Number(lgu.population || 0),
                score,
                riskLevel,
                procurementCount: lguProcurements.length,
                totalAmount,
                factors: riskScore?.factors || {},
              }
            })

            return { lguRiskRows, procurements, audits }
          })
        }

        const nextData = await pendingRiskData
        cachedRiskData = nextData

        if (!cancelled) {
          setState({
            loading: false,
            error: '',
            ...nextData,
          })
        }
      } catch (error) {
        pendingRiskData = null
        if (!cancelled) {
          setState((current) => ({
            ...current,
            loading: false,
            error: error.message || 'Unable to load backend data',
          }))
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return useMemo(() => {
    const sortedByRisk = [...state.lguRiskRows].sort((a, b) => b.score - a.score)
    const sortedByTrust = [...state.lguRiskRows].sort((a, b) => a.score - b.score)
    const totalLGUs = state.lguRiskRows.length
    const avgRisk = totalLGUs
      ? (state.lguRiskRows.reduce((sum, item) => sum + item.score, 0) / totalLGUs).toFixed(1)
      : '0.0'

    return {
      ...state,
      summary: {
        totalLGUs,
        highRisk: state.lguRiskRows.filter((item) => ['High', 'Critical'].includes(getRiskLevelLabel(item.score))).length,
        avgRisk,
        critical: state.lguRiskRows.filter((item) => getRiskLevelLabel(item.score) === 'Critical').length,
      },
      chartRows: sortedByRisk.map((item) => ({
        name: item.name.replace(/^City of /, '').replace(/^Municipality of /, ''),
        score: Number(item.score.toFixed(2)),
        riskLevel: item.riskLevel,
      })),
      topRiskRows: sortedByRisk.slice(0, 10),
      trustworthyRows: sortedByTrust.slice(0, 5),
      auditRows: state.audits.map((entry) => {
        const lgu = state.lguRiskRows.find((row) => row.id === entry.entity_id)
        return {
          timestamp: entry.created_at || entry.updated_at || '',
          logId: entry.id,
          entityId: entry.entity_id,
          city: lgu?.name || cleanLguName(entry.entity_id),
          action: entry.action,
          details: formatDetails(entry.details),
          riskLevel: normalizeRiskLevel(entry.details?.severity, entry.action === 'upsert' ? 45 : 15),
          category: entry.details?.category || 'System',
          amount: Number(entry.details?.amount || 0),
          recommendation: entry.details?.recommendation || '',
          coaPattern: entry.details?.coa_pattern || '',
          relatedReference: entry.details?.related_reference || '',
        }
      }),
    }
  }, [state])
}
