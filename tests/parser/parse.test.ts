import { describe, it, expect } from 'vitest'
import { parseMarkdown, serializeMarkdown } from '../../src/parser/parse.js'

describe('parseMarkdown', () => {
  it('parses a simple heading', () => {
    const ast = parseMarkdown('# Hello')
    expect(ast.children).toHaveLength(1)
    expect(ast.children[0].type).toBe('heading')
  })

  it('parses multiple elements', () => {
    const ast = parseMarkdown('# Title\n\nParagraph text')
    expect(ast.children.length).toBeGreaterThanOrEqual(2)
  })

  it('parses frontmatter (YAML)', () => {
    const content = `---
title: Test
date: 2024-01-01
---

# Content`
    const ast = parseMarkdown(content)
    expect(ast.children[0].type).toBe('yaml')
  })

  it('parses code blocks without interpreting content', () => {
    const content = `# Title

\`\`\`js
const x = 1
\`\`\``
    const ast = parseMarkdown(content)
    const codeNode = ast.children.find((n) => n.type === 'code')
    expect(codeNode).toBeDefined()
  })

  it('handles empty input', () => {
    const ast = parseMarkdown('')
    expect(ast.children).toHaveLength(0)
  })

  it('handles malformed frontmatter gracefully', () => {
    const content = `---
title: unclosed

# Content`
    const ast = parseMarkdown(content)
    expect(ast).toBeDefined()
  })
})

describe('serializeMarkdown errors', () => {
  it('throws ExportError on serialization failure', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(() => serializeMarkdown({ type: 'root', children: null } as any)).toThrow()
  })
})

describe('serializeMarkdown', () => {
  it('serializes back to markdown', () => {
    const ast = parseMarkdown('# Hello')
    const result = serializeMarkdown(ast)
    expect(result).toContain('# Hello')
  })

  it('preserves frontmatter', () => {
    const content = `---
title: Test
---

# Content`
    const ast = parseMarkdown(content)
    const result = serializeMarkdown(ast)
    expect(result).toContain('title: Test')
  })

  it('preserves code blocks', () => {
    const content = `# Title

\`\`\`js
const x = 1
\`\`\``
    const ast = parseMarkdown(content)
    const result = serializeMarkdown(ast)
    expect(result).toContain('const x = 1')
  })

  it('handles empty AST', () => {
    const result = serializeMarkdown({ type: 'root', children: [] })
    expect(result).toBe('')
  })
})
