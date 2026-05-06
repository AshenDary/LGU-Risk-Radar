function Card({ children, className = '', ...props }) {
  return (
    <section
      className={`rounded-xl border border-cyan-200/10 bg-[#041d2f] p-5 shadow-sm shadow-black/25 ${className}`}
      {...props}
    >
      {children}
    </section>
  )
}

export default Card
