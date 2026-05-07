function Card({ children, className = '', ...props }) {
  return (
    <section
      className={`premium-card premium-hover reveal-on-scroll rounded-2xl p-6 sm:p-7 ${className}`}
      {...props}
    >
      {children}
    </section>
  )
}

export default Card
