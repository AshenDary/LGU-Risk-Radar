import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const MENU_GAP = 8
const MENU_MAX_HEIGHT = 240

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
  const [menuStyle, setMenuStyle] = useState(null)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)
  const menuRef = useRef(null)

  const selectedOption = options.find((option) => getOptionValue(option) === value)
  const selectedLabel = selectedOption ? getOptionLabel(selectedOption) : placeholder

  function updateMenuPosition() {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const spaceBelow = viewportHeight - rect.bottom - MENU_GAP
    const spaceAbove = rect.top - MENU_GAP
    const openUp = spaceBelow < 180 && spaceAbove > spaceBelow
    const availableHeight = Math.max(140, Math.min(MENU_MAX_HEIGHT, openUp ? spaceAbove : spaceBelow))

    setMenuStyle({
      left: `${rect.left}px`,
      top: openUp ? 'auto' : `${rect.bottom + MENU_GAP}px`,
      bottom: openUp ? `${viewportHeight - rect.top + MENU_GAP}px` : 'auto',
      width: `${rect.width}px`,
      maxHeight: `${availableHeight}px`,
    })
  }

  useEffect(() => {
    if (!isOpen) return undefined

    updateMenuPosition()

    const closeOnOutsidePointerDown = (event) => {
      const target = event.target
      if (!dropdownRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setIsOpen(false)
      }
    }

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('resize', updateMenuPosition)
    window.addEventListener('scroll', updateMenuPosition, true)
    document.addEventListener('pointerdown', closeOnOutsidePointerDown)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      window.removeEventListener('resize', updateMenuPosition)
      window.removeEventListener('scroll', updateMenuPosition, true)
      document.removeEventListener('pointerdown', closeOnOutsidePointerDown)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  const menu = isOpen && menuStyle ? createPortal(
    <div
      ref={menuRef}
      className="dashboard-scrollbar fixed z-[9999] overflow-y-auto rounded-xl border border-[#38BDF8]/35 bg-white p-2 shadow-2xl shadow-[#2563EB]/20"
      style={menuStyle}
    >
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
    </div>,
    document.body
  ) : null

  return (
    <div ref={dropdownRef} className={`relative min-w-0 ${isOpen ? 'z-[2000]' : 'z-20'} ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          updateMenuPosition()
          setIsOpen((current) => !current)
        }}
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl border border-[#38BDF8]/35 bg-gradient-to-r from-white via-[#F8FAFC] to-[#EFF6FF] px-4 py-2.5 text-left text-sm font-bold text-[#0F172A] shadow-sm outline-none transition hover:border-[#2563EB]/55 hover:bg-[#EFF6FF] focus:border-[#2563EB] focus:ring-4 focus:ring-[#38BDF8]/15"
        aria-expanded={isOpen}
        aria-labelledby={labelId}
      >
        <span className="min-w-0 truncate">{selectedLabel}</span>
        <span className={`shrink-0 text-[#2563EB] transition-transform ${isOpen ? 'rotate-180' : ''}`}>v</span>
      </button>
      {menu}
    </div>
  )
}

export default DropdownSelect
