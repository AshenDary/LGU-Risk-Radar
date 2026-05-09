export const RISK_LEVELS = {
  LOW: {
    min: 0,
    max: 30,
    label: 'Low',
    color: '#22C55E',
  },
  MEDIUM: {
    min: 31,
    max: 60,
    label: 'Medium',
    color: '#F59E0B',
  },
  HIGH: {
    min: 61,
    max: 80,
    label: 'High',
    color: '#F97316',
  },
  CRITICAL: {
    min: 81,
    max: 100,
    label: 'Critical',
    color: '#EF4444',
  },
}

export const RISK_LEVEL_ORDER = [
  RISK_LEVELS.LOW,
  RISK_LEVELS.MEDIUM,
  RISK_LEVELS.HIGH,
  RISK_LEVELS.CRITICAL,
]

export function getRiskLevel(score) {
  const numericScore = Math.max(0, Math.min(100, Number(score) || 0))
  if (numericScore <= RISK_LEVELS.LOW.max) return RISK_LEVELS.LOW
  if (numericScore <= RISK_LEVELS.MEDIUM.max) return RISK_LEVELS.MEDIUM
  if (numericScore <= RISK_LEVELS.HIGH.max) return RISK_LEVELS.HIGH
  return RISK_LEVELS.CRITICAL
}

export function getRiskLevelLabel(score) {
  return getRiskLevel(score).label
}

export function normalizeRiskLevel(level, score = 0) {
  const normalizedLabel = `${level || ''}`.trim().toLowerCase()
  const matchedLevel = RISK_LEVEL_ORDER.find((riskLevel) => riskLevel.label.toLowerCase() === normalizedLabel)
  return matchedLevel?.label || getRiskLevelLabel(score)
}

export function getRiskLevelColor(value, score = 0) {
  const label = typeof value === 'number' ? getRiskLevelLabel(value) : normalizeRiskLevel(value, score)
  return RISK_LEVEL_ORDER.find((level) => level.label === label)?.color || RISK_LEVELS.LOW.color
}

export function getRiskBadgeClass(value, score = 0) {
  const label = typeof value === 'number' ? getRiskLevelLabel(value) : normalizeRiskLevel(value, score)
  const badgeClasses = {
    Low: 'border-green-200 bg-green-50 text-green-700',
    Medium: 'border-amber-200 bg-amber-50 text-amber-700',
    High: 'border-orange-200 bg-orange-50 text-orange-700',
    Critical: 'border-red-200 bg-red-50 text-red-700',
  }

  return badgeClasses[label] || badgeClasses.Low
}
