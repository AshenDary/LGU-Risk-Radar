function Card({ children, className = '', ...props }) {
  return (
    <section
      className={`premium-card premium-hover reveal-on-scroll min-w-0 rounded-2xl p-4 sm:p-6 lg:p-7 ${className}`}
      {...props}
    >
      {children}
    </section>
  )
}

export default Card
