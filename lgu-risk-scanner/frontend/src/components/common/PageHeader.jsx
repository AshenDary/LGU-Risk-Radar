function PageHeader({ title, description }) {
  return (
<<<<<<< HEAD
    <div className="min-w-0">
      <h1 className="break-words text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">{title}</h1>
=======
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">{title}</h1>
>>>>>>> parent of 9ba0142 (FINAL UI CHANGES)
      {description ? (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#1E293B]/70">{description}</p>
      ) : null}
    </div>
  )
}

export default PageHeader
