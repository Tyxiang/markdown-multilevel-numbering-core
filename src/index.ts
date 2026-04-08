import { readFile, writeFile } from 'node:fs/promises'
import { parseMarkdown, serializeMarkdown } from './parser/parse.js'
import { extractDirectives } from './parser/extract.js'
import { createInitialState } from './numbering/state.js'
import { applyNumbering, stripNumbering } from './numbering/apply.js'
import { ExportError } from './utils/errors.js'

export function updateText(content: string): string {
  const cleanContent = stripNumbering(content)
  const directives = extractDirectives(cleanContent)
  const ast = parseMarkdown(cleanContent)
  const state = createInitialState()

  applyNumbering(ast, state, directives)
  return serializeMarkdown(ast)
}

export async function updateFile(filePath: string): Promise<void> {
  try {
    const content = await readFile(filePath, 'utf-8')
    const result = updateText(content)
    await writeFile(filePath, result, 'utf-8')
  } catch (error) {
    throw new ExportError(`Failed to update file ${filePath}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export function removeText(content: string): string {
  return stripNumbering(content)
}

export async function removeFile(filePath: string): Promise<void> {
  try {
    const content = await readFile(filePath, 'utf-8')
    const result = removeText(content)
    await writeFile(filePath, result, 'utf-8')
  } catch (error) {
    throw new ExportError(`Failed to remove file ${filePath}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export { parseMarkdown, serializeMarkdown } from './parser/parse.js'
export { extractDirectives } from './parser/extract.js'
export type { DirectiveWithOffset } from './parser/extract.js'
export { createInitialState, applyDirective, incrementCounter } from './numbering/state.js'
export { applyNumbering, stripNumbering } from './numbering/apply.js'
export { ParseError, ExportError, NumberingError } from './utils/errors.js'
