import { visit } from "unist-util-visit";
import type { Root, Heading, Paragraph, Text } from "mdast";
import type { Node } from "unist";
import type { NumberingState } from "./types.js";
import { incrementCounter, applyDirective } from "./state.js";
import type { DirectiveWithOffset } from "../parser/extract.js";
import { parseMarkdown, serializeMarkdown } from "../parser/parse.js";

function isTextLiteral(node: Node): node is Text {
  return node.type === "text";
}

export function applyNumbering(
  ast: Root,
  state: NumberingState,
  directives: DirectiveWithOffset[],
): Root {
  let headingPrefix = "";
  let paragraphIndex = 0;
  let directiveIndex = 0;
  let firstH1Found = false;
  let secondH1Found = false;

  visit(
    ast,
    (node: Node, index: number | undefined, parent: Node | undefined) => {
      const nodeOffset = node.position?.start?.offset ?? 0;

      while (
        directiveIndex < directives.length &&
        directives[directiveIndex].offset <= nodeOffset
      ) {
        applyDirective(state, directives[directiveIndex].type);
        directiveIndex++;
      }

      if (node.type === "html") {
        const htmlNode = node as Node & {
          value?: string;
          _mmnDirective?: boolean;
        };
        const value = htmlNode.value || "";
        if (/^\s*<!--\s*mmn:/.test(value)) {
          htmlNode._mmnDirective = true;
        }
        return;
      }

      if (secondH1Found) return;

      if (!state.active) return;

      const excludedParentTypes = [
        "blockquote",
        "list",
        "listItem",
        "table",
        "tableRow",
        "tableCell",
      ];
      if (parent && excludedParentTypes.includes(parent.type)) {
        return;
      }

      if (
        node.type === "blockquote" ||
        node.type === "list" ||
        node.type === "listItem" ||
        node.type === "table" ||
        node.type === "tableRow" ||
        node.type === "tableCell" ||
        node.type === "image" ||
        node.type === "code" ||
        node.type === "math"
      ) {
        return;
      }

      if (node.type === "heading") {
        const heading = node as Heading;

        if (heading.depth === 1) {
          if (firstH1Found) {
            secondH1Found = true;
            state.active = false;
            return;
          }
          firstH1Found = true;
          headingPrefix = "";
          return;
        }

        paragraphIndex = 0;

        if (heading.depth > state.depth + 1) {
          headingPrefix = "";
          return;
        }

        const number = incrementCounter(state, heading.depth);
        headingPrefix = number;

        let prefix: string;
        if (state.mode === "appendix" && heading.depth === 2) {
          prefix = `附录 ${number} `;
        } else {
          prefix = `${number}. `;
        }

        if (heading.children.length > 0 && isTextLiteral(heading.children[0])) {
          const firstChild = heading.children[0];
          firstChild.value = prefix + firstChild.value;
        } else {
          heading.children.unshift({ type: "text", value: prefix });
        }
      }

      if (node.type === "paragraph" && state.scope === "heading+paragraph") {
        if (!headingPrefix) return;

        const paragraph = node as Paragraph;

        // Skip paragraphs where first child is an image
        if (
          paragraph.children.length > 0 &&
          paragraph.children[0].type === "image"
        ) {
          return;
        }

        paragraphIndex++;
        const number = `${headingPrefix}.${paragraphIndex}`;
        const prefix = `${number}. `;

        if (
          paragraph.children.length > 0 &&
          isTextLiteral(paragraph.children[0])
        ) {
          const firstChild = paragraph.children[0];
          firstChild.value = prefix + firstChild.value;
        } else {
          paragraph.children.unshift({ type: "text", value: prefix });
        }
      }
    },
  );

  return ast;
}

const HEADING_PREFIX_REGEX = /^(附录 [A-Z] |[\dA-Z]+(?:\.[\dA-Z]+)*\. )/;
const PARAGRAPH_PREFIX_REGEX = /^([\dA-Z]+\.[\dA-Z]+(?:\.[\dA-Z]+)*\. )/;

export function stripNumbering(content: string): string {
  const ast = parseMarkdown(content);

  visit(ast, (node: Node) => {
    if (node.type === "heading") {
      const heading = node as Heading;
      if (heading.children.length > 0 && heading.children[0].type === "text") {
        const value = heading.children[0].value;
        const match = value.match(HEADING_PREFIX_REGEX);
        if (match) {
          heading.children[0].value = value.slice(match[0].length);
        }
      }
    }

    if (node.type === "paragraph") {
      const paragraph = node as Paragraph;
      if (
        paragraph.children.length > 0 &&
        paragraph.children[0].type === "text"
      ) {
        const value = paragraph.children[0].value;
        const match = value.match(PARAGRAPH_PREFIX_REGEX);
        if (match) {
          paragraph.children[0].value = value.slice(match[0].length);
        }
      }
    }
  });

  return serializeMarkdown(ast);
}
