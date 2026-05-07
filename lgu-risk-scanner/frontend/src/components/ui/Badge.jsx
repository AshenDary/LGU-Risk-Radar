const badgeVariants = {
  default: 'border-slate-200 bg-[#F8FAFC] text-[#1E293B]',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  danger: 'border-red-500/30 bg-red-500/10 text-red-300',
}

function Badge({ children, variant = 'default', className = '', ...props }) {
  const variantClasses = badgeVariants[variant] ?? badgeVariants.default

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
