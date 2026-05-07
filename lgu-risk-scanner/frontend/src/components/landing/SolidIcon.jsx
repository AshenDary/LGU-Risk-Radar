const icons = {
  chart: (
    <path d="M5 19h14v2H3V3h2v16Zm3-2H6V9h2v8Zm5 0h-2V5h2v12Zm5 0h-2v-6h2v6Z" />
  ),
  shield: (
    <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Zm3.7 8.7-4.3 4.3-2.6-2.6 1.4-1.4 1.2 1.2 2.9-2.9 1.4 1.4Z" />
  ),
  map: (
    <path d="m15 5 6-2v16l-6 2-6-2-6 2V5l6-2 6 2Zm-5 .2v11.9l4 1.4V6.6l-4-1.4Zm6 1.4v11.9l3-1V5.6l-3 1ZM5 6.5v11.9l3-1V5.5l-3 1Z" />
  ),
  search: (
    <path d="M10.5 3a7.5 7.5 0 0 1 5.9 12.1l4.2 4.2-1.4 1.4-4.2-4.2A7.5 7.5 0 1 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" />
  ),
  sliders: (
    <path d="M4 7h8a3 3 0 0 0 5.8 0H20V5h-2.2a3 3 0 0 0-5.8 0H4v2Zm11-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM4 19h2.2a3 3 0 0 0 5.8 0h8v-2h-8a3 3 0 0 0-5.8 0H4v2Zm5-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM4 13h11.2a3 3 0 0 0 5.6 0H20v-2h-.2a3 3 0 0 0-5.6 0H4v2Zm14-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
  ),
  document: (
    <path d="M6 2h8l5 5v15H6V2Zm7 1.5V8h4.5L13 3.5ZM8 12v2h8v-2H8Zm0 4v2h8v-2H8Z" />
  ),
  compare: (
    <path d="M7 3h10v4h4v10h-4v4H7v-4H3V7h4V3Zm2 2v14h6V5H9Zm8 4v6h2V9h-2ZM5 9v6h2V9H5Z" />
  ),
  lock: (
    <path d="M7 10V7a5 5 0 0 1 10 0v3h2v11H5V10h2Zm2 0h6V7a3 3 0 0 0-6 0v3Zm2 4v3h2v-3h-2Z" />
  ),
  database: (
    <path d="M12 3c4.4 0 8 1.6 8 3.5v11c0 1.9-3.6 3.5-8 3.5s-8-1.6-8-3.5v-11C4 4.6 7.6 3 12 3Zm0 2C8.2 5 6.2 6.1 6 6.5 6.2 6.9 8.2 8 12 8s5.8-1.1 6-1.5C17.8 6.1 15.8 5 12 5Zm6 4.1A14.2 14.2 0 0 1 12 10a14.2 14.2 0 0 1-6-.9v3.4c.2.4 2.2 1.5 6 1.5s5.8-1.1 6-1.5V9.1Zm0 6A14.2 14.2 0 0 1 12 16a14.2 14.2 0 0 1-6-.9v2.4c.2.4 2.2 1.5 6 1.5s5.8-1.1 6-1.5v-2.4Z" />
  ),
}

export default function SolidIcon({ name, className = 'h-6 w-6' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      focusable="false"
    >
      {icons[name] || icons.chart}
    </svg>
  )
}
