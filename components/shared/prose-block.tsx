function formatInline(text: string): string {
  return text
    .replace(
      /\*\*([^*]+)\*\*/g,
      '<strong class="font-medium text-foreground">$1</strong>',
    )
    .replace(
      /`([^`]+)`/g,
      '<code class="rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground">$1</code>',
    )
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="font-medium text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>',
    )
}

function isTableBlock(block: string): boolean {
  const lines = block.trim().split("\n")
  return lines.length >= 2 && lines.every((line) => line.trim().startsWith("|"))
}

function isUnorderedListBlock(block: string): boolean {
  const lines = block.trim().split("\n")
  return lines.length > 0 && lines.every((line) => /^[-*]\s+/.test(line.trim()))
}

function isOrderedListBlock(block: string): boolean {
  const lines = block.trim().split("\n")
  return lines.length > 0 && lines.every((line) => /^\d+\.\s+/.test(line.trim()))
}

function isBoldHeadingLine(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.startsWith("**") && trimmed.endsWith("**") && !trimmed.slice(2, -2).includes("**")
}

function TableBlock({ block }: { block: string }) {
  const rows = block
    .trim()
    .split("\n")
    .filter((line) => line.trim().startsWith("|") && !line.includes("---"))

  if (rows.length === 0) return null

  const parseRow = (row: string) =>
    row
      .split("|")
      .filter(Boolean)
      .map((cell) => cell.trim())

  const [headerRow, ...bodyRows] = rows

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface">
            {parseRow(headerRow).map((cell, i) => (
              <th
                key={i}
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-foreground"
                dangerouslySetInnerHTML={{ __html: formatInline(cell) }}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border last:border-0">
              {parseRow(row).map((cell, i) => (
                <td
                  key={i}
                  className="px-4 py-2.5 text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: formatInline(cell) }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ListBlock({
  ordered,
  block,
}: {
  ordered: boolean
  block: string
}) {
  const items = block.trim().split("\n").map((line) => {
    const trimmed = line.trim()
    if (ordered) return trimmed.replace(/^\d+\.\s+/, "")
    return trimmed.replace(/^[-*]\s+/, "")
  })

  const Tag = ordered ? "ol" : "ul"
  const listClass = ordered
    ? "list-decimal space-y-2 pl-5 marker:text-muted-foreground"
    : "list-disc space-y-2 pl-5 marker:text-muted-foreground"

  return (
    <Tag className={listClass}>
      {items.map((item, index) => (
        <li
          key={index}
          className="pl-1 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatInline(item) }}
        />
      ))}
    </Tag>
  )
}

function ParagraphBlock({ block }: { block: string }) {
  return (
    <p
      className="leading-relaxed"
      dangerouslySetInnerHTML={{ __html: formatInline(block.trim()) }}
    />
  )
}

function renderBlock(block: string, index: number) {
  const trimmed = block.trim()
  if (!trimmed) return null

  if (isTableBlock(trimmed)) {
    return <TableBlock key={index} block={trimmed} />
  }

  if (isUnorderedListBlock(trimmed)) {
    return <ListBlock key={index} ordered={false} block={trimmed} />
  }

  if (isOrderedListBlock(trimmed)) {
    return <ListBlock key={index} ordered={true} block={trimmed} />
  }

  const lines = trimmed.split("\n")
  if (lines.length > 1 && isBoldHeadingLine(lines[0])) {
    const headingText = lines[0].trim().slice(2, -2)
    const rest = lines.slice(1).join("\n").trim()
    return (
      <div key={index} className="space-y-2">
        <p className="text-sm font-semibold text-foreground">{headingText}</p>
        {rest ? <ParagraphBlock block={rest} /> : null}
      </div>
    )
  }

  if (lines.length === 1 && isBoldHeadingLine(trimmed)) {
    return (
      <p key={index} className="text-sm font-semibold text-foreground">
        {trimmed.slice(2, -2)}
      </p>
    )
  }

  return <ParagraphBlock key={index} block={trimmed} />
}

export function ProseBlock({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/)

  return (
    <div className="space-y-4 text-sm text-muted-foreground">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  )
}
