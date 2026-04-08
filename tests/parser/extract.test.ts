import { describe, it, expect } from 'vitest'
import { extractDirectives } from '../../src/parser/extract.js'

describe('extractDirectives', () => {
  it('extracts a single directive', () => {
    const content = '<!-- mmn: mainbody -->'
    const directives = extractDirectives(content)
    expect(directives).toHaveLength(1)
    expect(directives[0].type).toBe('mainbody')
  })

  it('extracts multiple directives in one comment', () => {
    const content = '<!-- mmn: mainbody h3 -->'
    const directives = extractDirectives(content)
    expect(directives).toHaveLength(2)
    expect(directives[0].type).toBe('mainbody')
    expect(directives[1].type).toBe('h3')
  })

  it('extracts directives from multiple comments', () => {
    const content = '<!-- mmn: mainbody -->\n<!-- mmn: h+p -->'
    const directives = extractDirectives(content)
    expect(directives).toHaveLength(2)
  })

  it('ignores invalid directives', () => {
    const content = '<!-- mmn: mainbody invalid h3 -->'
    const directives = extractDirectives(content)
    expect(directives).toHaveLength(2)
    expect(directives.map((d) => d.type)).toEqual(['mainbody', 'h3'])
  })

  it('returns empty array for no directives', () => {
    const content = '# Hello World'
    const directives = extractDirectives(content)
    expect(directives).toHaveLength(0)
  })

  it('handles extra whitespace', () => {
    const content = '<!--   mmn:   mainbody   h   -->'
    const directives = extractDirectives(content)
    expect(directives).toHaveLength(2)
  })

  it('includes offset for position tracking', () => {
    const content = 'prefix<!-- mmn: mainbody -->'
    const directives = extractDirectives(content)
    expect(directives[0].offset).toBe(6)
  })
})
