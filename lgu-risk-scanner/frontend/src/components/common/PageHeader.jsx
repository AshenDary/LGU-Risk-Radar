function PageHeader({ title, description }) {
  return (
    <div className="min-w-0">
      <h1 className="break-words text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">{title}</h1>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#475569]">{description}</p>
      ) : null}
    </div>
  )
}

export default PageHeader
