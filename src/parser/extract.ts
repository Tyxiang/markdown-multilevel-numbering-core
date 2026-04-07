import { visit } from "unist-util-visit";
import type { Node } from "unist";
import type { Root } from "mdast";
import type { ParsedDirective, DirectiveType } from '../numbering/types.js'
import { parseMarkdown } from './parse.js'

const DIRECTIVE_REGEX = /^\s*<!--\s*mmn:\s*(.+?)\s*-->\s*$/

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
  const ast = parseMarkdown(content)

  visit(ast, (node: Node) => {
    if (node.type === 'html') {
      const htmlNode = node as Node & { value?: string }
      const value = htmlNode.value || ''
      const match = value.match(DIRECTIVE_REGEX)
      if (match) {
        const offset = node.position?.start?.offset ?? 0
        const parts = match[1].trim().split(/\s+/)
        for (const part of parts) {
          if (VALID_DIRECTIVES.includes(part as DirectiveType)) {
            directives.push({
              type: part as DirectiveType,
              raw: value,
              position: { start: offset, end: offset + value.length },
              offset,
            })
          }
        }
      }
    }
  })

  return directives
}
