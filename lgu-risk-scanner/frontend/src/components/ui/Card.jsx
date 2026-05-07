function Card({ children, className = '', ...props }) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/80 ${className}`}
      {...props}
    >
      {children}
    </section>
  )
}

export default Card
