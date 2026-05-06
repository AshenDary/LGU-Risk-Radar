function PageHeader({ title, description }) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-cyan-50/60">{description}</p>
      ) : null}
    </div>
  )
}

export default PageHeader
