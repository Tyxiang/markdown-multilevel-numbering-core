import type { ParsedDirective, DirectiveType } from '../numbering/types.js'

const DIRECTIVE_REGEX = /<!--\s*mmn:\s*(.+?)\s*-->/g

const VALID_DIRECTIVES: DirectiveType[] = [
  'mainbody',
  'appendix',
  'h',
  'h+p',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'end',
]

export interface DirectiveWithOffset extends ParsedDirective {
  offset: number
}

export function extractDirectives(content: string): DirectiveWithOffset[] {
  const directives: DirectiveWithOffset[] = []
  let match

  while ((match = DIRECTIVE_REGEX.exec(content)) !== null) {
    const parts = match[1].trim().split(/\s+/)
    for (const part of parts) {
      if (VALID_DIRECTIVES.includes(part as DirectiveType)) {
        directives.push({
          type: part as DirectiveType,
          raw: match[0],
          position: { start: match.index, end: match.index + match[0].length },
          offset: match.index,
        })
      }
    }
  }

  return directives
}
