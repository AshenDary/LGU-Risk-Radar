import { useEffect, useRef, useState } from 'react'

function DropdownSelect({
  value,
  options,
  onChange,
  getOptionLabel = (option) => option,
  getOptionValue = (option) => option,
  placeholder = 'Select option',
  labelId,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const selectedOption = options.find((option) => getOptionValue(option) === value)
  const selectedLabel = selectedOption ? getOptionLabel(selectedOption) : placeholder

  useEffect(() => {
    if (!isOpen) return undefined

    const closeOnOutsidePointerDown = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePointerDown)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointerDown)
  }, [isOpen])

  return (
    <div ref={dropdownRef} className={`relative min-w-0 ${isOpen ? 'z-[2000]' : 'z-20'} ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl border border-[#38BDF8]/35 bg-gradient-to-r from-white via-[#F8FAFC] to-[#EFF6FF] px-4 py-2.5 text-left text-sm font-bold text-[#0F172A] shadow-sm outline-none transition hover:border-[#2563EB]/55 hover:bg-[#EFF6FF] focus:border-[#2563EB] focus:ring-4 focus:ring-[#38BDF8]/15"
        aria-expanded={isOpen}
        aria-labelledby={labelId}
      >
        <span className="min-w-0 truncate">{selectedLabel}</span>
        <span className={`shrink-0 text-[#2563EB] transition-transform ${isOpen ? 'rotate-180' : ''}`}>v</span>
      </button>

      {isOpen ? (
        <div className="dashboard-scrollbar absolute right-0 top-[calc(100%+0.5rem)] z-[2001] max-h-60 w-full overflow-y-auto rounded-xl border border-[#38BDF8]/35 bg-white p-2 shadow-lg shadow-[#2563EB]/15">
          {options.map((option) => {
            const optionValue = getOptionValue(option)
            const active = optionValue === value

            return (
              <button
                key={optionValue}
                type="button"
                onClick={() => {
                  onChange(optionValue, option)
                  setIsOpen(false)
                }}
                className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold leading-5 transition ${
                  active
                    ? 'bg-[#EFF6FF] text-[#2563EB]'
                    : 'text-[#0F172A] hover:bg-[#F8FAFC] hover:text-[#2563EB]'
                }`}
              >
                {getOptionLabel(option)}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default DropdownSelect
