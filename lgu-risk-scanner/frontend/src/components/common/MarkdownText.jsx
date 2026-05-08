function renderInlineMarkdown(text) {
  return String(text)
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={`${part}-${index}`} className="font-black text-[#0F172A]">
            {part.slice(2, -2)}
          </strong>
        )
      }

      return <span key={`${part}-${index}`}>{part}</span>
    })
}

function MarkdownText({ text, className = '' }) {
  const blocks = String(text || '').split(/\n{2,}/)

  return (
    <div className={className}>
      {blocks.map((block, blockIndex) => {
        const lines = block.split('\n')

        return (
          <p key={`${block}-${blockIndex}`} className={blockIndex > 0 ? 'mt-4' : ''}>
            {lines.map((line, lineIndex) => (
              <span key={`${line}-${lineIndex}`}>
                {lineIndex > 0 ? <br /> : null}
                {renderInlineMarkdown(line)}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}

export default MarkdownText
