import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import type { Root } from "mdast";
import { ParseError, ExportError } from "../utils/errors.js";

export function parseMarkdown(content: string): Root {
  try {
    return unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkFrontmatter, ["yaml"])
      .parse(content);
  } catch (error) {
    throw new ParseError(
      `Failed to parse markdown: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export function serializeMarkdown(ast: Root): string {
  try {
    return unified()
      .use(remarkFrontmatter, ["yaml"])
      .use(remarkMath)
      .use(remarkGfm)
      .use(remarkStringify, {
        bullet: "-",
        emphasis: "*",
        strong: "*",
        fence: "`",
        fences: true,
      })
      .stringify(ast);
  } catch (error) {
    throw new ExportError(
      `Failed to serialize markdown: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
