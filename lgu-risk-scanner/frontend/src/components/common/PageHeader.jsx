function PageHeader({ title, description }) {
  return (
    <div>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0F172A]">Bantay Bayan {title}</h1>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#475569]">{description}</p>
      ) : null}
    </div>
  )
}

export default PageHeader
