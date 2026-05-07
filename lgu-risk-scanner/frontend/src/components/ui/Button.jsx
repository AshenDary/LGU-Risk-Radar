const buttonVariants = {
  primary: 'bg-[#2563EB] text-white shadow-sm shadow-[#2563EB]/20 hover:bg-[#0F172A]',
  secondary: 'border border-slate-200 bg-white text-[#0F172A] hover:bg-[#F8FAFC]',
  ghost: 'text-[#1E293B]/70 hover:bg-[#F8FAFC] hover:text-[#0F172A]',
}

function Button({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  ...props
}) {
  const variantClasses = buttonVariants[variant] ?? buttonVariants.primary

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
