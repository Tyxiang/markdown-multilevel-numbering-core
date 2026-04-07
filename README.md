# Markdown Multilevel Numbering (mmn)

English | [中文](./README_CN.md)

A tool for adding multilevel numbering to markdown documents, supporting both mainbody and appendix numbering modes with flexible control via directives.

## 1. Features

- Mainbody mode numbering for headings and paragraphs: `1.`, `1.1.`, `1.1.1.` ...
- Appendix mode numbering for headings and paragraphs: `A.`, `A.1.`, `A.1.1.` ...
- Appendix H2 heading format: `Appendix A Heading`
- Flexible control of numbering behavior via directives
- Level 1 headings never participate in numbering
- Only processes content within the logical scope of the first H1; subsequent H1s and their content are ignored
- Reliable AST-based parsing that protects code blocks, lists, tables, and math expressions from being accidentally modified

## 2. Control Directives

Insert control directives in markdown using HTML comments to control numbering behavior.

Comment format: `<!-- mmn: command [command...] -->`

| command    | Description                                               |
| ---------- | --------------------------------------------------------- |
| `mainbody` | Numbering mode directive, starts mainbody mode with default depth `h` |
| `appendix` | Numbering mode directive, starts appendix mode with default depth `h` |
| `h`        | Depth directive, number all heading levels               |
| `h+p`      | Depth directive, number all heading levels and paragraphs |
| `h2`       | Depth directive, number level 2 headings only             |
| `h3`       | Depth directive, number level 2-3 headings                |
| `h4`       | Depth directive, number level 2-4 headings                |
| `h5`       | Depth directive, number level 2-5 headings                |
| `h6`       | Depth directive, number level 2-6 headings                |
| `end`      | End numbering                                            |

After program starts, it defaults to `mainbody` mode.

## 3. Coding Logic Examples

See `doc/numbering-logic-demo.md`

## 4. Implementation Approach

- Parse markdown into AST
- Traverse elements: extract directives, add numbering (update) / remove numbering (remove)
- Convert AST back to markdown

## 5. Installation

Using npm:

```bash
npm install markdown-multilevel-numbering
```

Using pnpm:

```bash
pnpm add markdown-multilevel-numbering
```

## 6. Usage

```typescript
import {
  updateText,
  removeText,
  updateFile,
  removeFile,
} from "markdown-multilevel-numbering";

// Process text
const numbered = updateText(markdownContent);
const cleaned = removeText(numberedContent);

// Process files directly
await updateFile("./input.md");
await removeFile("./numbered.md");
```

## 7. License

MIT
