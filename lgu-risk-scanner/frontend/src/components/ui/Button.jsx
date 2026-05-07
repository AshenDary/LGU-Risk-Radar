const buttonVariants = {
  primary: 'bg-[#2563EB] text-white shadow-sm shadow-[#2563EB]/20 hover:bg-[#0F172A] hover:shadow-lg hover:shadow-[#2563EB]/18',
  secondary: 'border border-[#38BDF8]/30 bg-white text-[#0F172A] hover:border-[#2563EB]/50 hover:bg-[#EFF6FF]',
  ghost: 'text-[#1E293B]/70 hover:bg-[#EFF6FF] hover:text-[#2563EB]',
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
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200 ease-out hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
