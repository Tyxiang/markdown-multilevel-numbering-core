import { describe, it, expect } from 'vitest'
import { parseMarkdown, serializeMarkdown } from '../../src/parser/parse.js'
import { extractDirectives } from '../../src/parser/extract.js'
import { createInitialState } from '../../src/numbering/state.js'
import { applyNumbering } from '../../src/numbering/apply.js'

describe('applyNumbering', () => {
  it('numbers h2 headings in mainbody mode', () => {
    const content = `# Title

<!-- mmn: mainbody h -->

## Section One

## Section Two
`
    const directives = extractDirectives(content)
    const ast = parseMarkdown(content)
    const state = createInitialState()

    applyNumbering(ast, state, directives)
    const result = serializeMarkdown(ast)

    expect(result).toContain('1. Section One')
    expect(result).toContain('2. Section Two')
  })

  it('numbers h2 and h3 with nested numbering', () => {
    const content = `# Title

<!-- mmn: mainbody h -->

## Section One

### Subsection A

### Subsection B

## Section Two
`
    const directives = extractDirectives(content)
    const ast = parseMarkdown(content)
    const state = createInitialState()

    applyNumbering(ast, state, directives)
    const result = serializeMarkdown(ast)

    expect(result).toContain('1. Section One')
    expect(result).toContain('1.1. Subsection A')
    expect(result).toContain('1.2. Subsection B')
    expect(result).toContain('2. Section Two')
  })

  it('numbers paragraphs with heading prefix', () => {
    const content = `# Title

<!-- mmn: mainbody h+p -->

## Section One

### Subsection A

This is paragraph one.

This is paragraph two.

### Subsection B

This is paragraph three.
`
    const directives = extractDirectives(content)
    const ast = parseMarkdown(content)
    const state = createInitialState()

    applyNumbering(ast, state, directives)
    const result = serializeMarkdown(ast)

    expect(result).toContain('1.1.1. This is paragraph one')
    expect(result).toContain('1.1.2. This is paragraph two')
    expect(result).toContain('1.2.1. This is paragraph three')
  })

  it('resets numbering in appendix mode', () => {
    const content = `# Title

<!-- mmn: mainbody h -->

## Section One

<!-- mmn: appendix h -->

## Appendix A

<!-- mmn: appendix h -->

## Appendix B
`
    const directives = extractDirectives(content)
    const ast = parseMarkdown(content)
    const state = createInitialState()

    applyNumbering(ast, state, directives)
    const result = serializeMarkdown(ast)

    expect(result).toContain('1. Section One')
    expect(result).toContain('附录 A Appendix A')
    expect(result).toContain('附录 A Appendix B')
  })

  it('stops numbering after end directive', () => {
    const content = `# Title

<!-- mmn: mainbody h -->

## Section One

<!-- mmn: end -->

## Unnumbered Section
`
    const directives = extractDirectives(content)
    const ast = parseMarkdown(content)
    const state = createInitialState()

    applyNumbering(ast, state, directives)
    const result = serializeMarkdown(ast)

    expect(result).toContain('1. Section One')
    expect(result).toContain('Unnumbered Section')
    expect(result).not.toContain('2. Unnumbered Section')
  })

  it('resets counters when switching modes', () => {
    const content = `# Title

<!-- mmn: mainbody h -->

## Section One

<!-- mmn: mainbody h -->

## Section Two
`
    const directives = extractDirectives(content)
    const ast = parseMarkdown(content)
    const state = createInitialState()

    applyNumbering(ast, state, directives)
    const result = serializeMarkdown(ast)

    expect(result).toContain('1. Section One')
    expect(result).toContain('1. Section Two')
  })
})
