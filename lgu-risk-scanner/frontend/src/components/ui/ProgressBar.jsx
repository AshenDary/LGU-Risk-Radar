const progressVariants = {
  default: 'bg-cyan-300',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-red-400',
}

function ProgressBar({ value = 0, max = 100, variant = 'default', className = '' }) {
  const safeMax = max > 0 ? max : 100
  const percentage = Math.min(Math.max((value / safeMax) * 100, 0), 100)
  const variantClasses = progressVariants[variant] ?? progressVariants.default

  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-cyan-950/60 ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ${variantClasses}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

export default ProgressBar
