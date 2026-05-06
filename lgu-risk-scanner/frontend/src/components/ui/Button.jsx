const buttonVariants = {
  primary: 'bg-cyan-400 text-slate-950 shadow-sm shadow-cyan-400/20 hover:bg-cyan-300',
  secondary: 'border border-cyan-200/10 bg-[#08263a] text-white hover:bg-[#0b3048]',
  ghost: 'text-cyan-50/70 hover:bg-cyan-100/10 hover:text-white',
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
