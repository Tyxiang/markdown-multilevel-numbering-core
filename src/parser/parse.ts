import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import type { Root } from 'mdast'

export function parseMarkdown(content: string): Root {
  return unified().use(remarkParse).use(remarkFrontmatter, ['yaml']).parse(content)
}

export function serializeMarkdown(ast: Root): string {
  return unified()
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkStringify, {
      bullet: '-',
      emphasis: '*',
      strong: '*',
      fence: '`',
      fences: true,
    })
    .stringify(ast)
}
