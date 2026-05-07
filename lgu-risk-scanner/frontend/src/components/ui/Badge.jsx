const badgeVariants = {
  default: 'border-slate-200 bg-[#F8FAFC] text-[#1E293B]',
  success: 'border-emerald-500/25 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-500/25 bg-amber-50 text-amber-700',
  danger: 'border-red-500/25 bg-red-50 text-red-700',
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
