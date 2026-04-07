import { describe, it, expect } from "vitest";
import {
  updateText,
  removeText,
  updateFile,
  removeFile,
} from "../../src/index.js";
import { ExportError } from "../../src/utils/errors.js";

describe("updateText", () => {
  it("adds numbering to markdown content", () => {
    const input = `# Title

<!-- mmn: mainbody h -->

## Section One

## Section Two
`;
    const result = updateText(input);

    expect(result).toContain("1. Section One");
    expect(result).toContain("2. Section Two");
  });

  it("adds numbering by default without directive", () => {
    const input = `# Title

## Section One

## Section Two
`;
    const result = updateText(input);

    expect(result).toContain("1. Section One");
    expect(result).toContain("2. Section Two");
  });

  it("stops numbering with end directive", () => {
    const input = `# Title

## Section One

<!-- mmn: end -->

## Section Two
`;
    const result = updateText(input);

    expect(result).toContain("1. Section One");
    expect(result).not.toContain("2. Section Two");
  });

  it("handles h+p directive for paragraph numbering", () => {
    const input = `# Title

<!-- mmn: mainbody h+p -->

## Section

### Subsection

Paragraph one.

Paragraph two.
`;
    const result = updateText(input);

    expect(result).toContain("1. Section");
    expect(result).toContain("1.1. Subsection");
    expect(result).toContain("1.1.1. Paragraph one");
    expect(result).toContain("1.1.2. Paragraph two");
  });

  it("handles appendix mode", () => {
    const input = `# Title

<!-- mmn: mainbody h -->

## Main Section

<!-- mmn: appendix h -->

## Appendix Section
`;
    const result = updateText(input);

    expect(result).toContain("1. Main Section");
    expect(result).toContain("附录 A Appendix Section");
  });

  it("preserves directive comments", () => {
    const input = `# Title

<!-- mmn: mainbody h -->

## Section
`;
    const result = updateText(input);

    expect(result).toContain("<!-- mmn: mainbody h -->");
  });

  it("handles multiple h1 - stops at second", () => {
    const input = `# First H1

<!-- mmn: mainbody h -->

## Section One

# Second H1

## Section Two
`;
    const result = updateText(input);

    expect(result).toContain("1. Section One");
    expect(result).toContain("Section Two");
  });

  it("handles empty input", () => {
    const result = updateText("");
    expect(result).toBe("");
  });

  it("preserves frontmatter", () => {
    const input = `---
title: Test
---

# Title

<!-- mmn: mainbody h -->

## Section
`;
    const result = updateText(input);
    expect(result).toContain("title: Test");
    expect(result).toContain("1. Section");
  });

  it("preserves code blocks without adding numbering", () => {
    const input = `# Title

<!-- mmn: mainbody h -->

## Section

\`\`\`js
const x = 1
\`\`\`
`;
    const result = updateText(input);
    expect(result).toContain("const x = 1");
    expect(result).not.toContain("1. const x");
  });

  it("handles deep heading levels with h6 directive", () => {
    const input = `# Title

<!-- mmn: mainbody h6 -->

## H2

### H3

#### H4

##### H5

###### H6
`;
    const result = updateText(input);
    expect(result).toContain("1. H2");
    expect(result).toContain("1.1. H3");
    expect(result).toContain("1.1.1. H4");
  });
});

describe("removeText", () => {
  it("removes heading numbering", () => {
    const input = `# Title

## 1. Section One

## 2. Section Two
`;
    const result = removeText(input);

    expect(result).toContain("Section One");
    expect(result).toContain("Section Two");
    expect(result).not.toContain("1. Section One");
    expect(result).not.toContain("2. Section Two");
  });

  it("removes appendix heading format", () => {
    const input = `# Title

## 附录 A Appendix Section
`;
    const result = removeText(input);

    expect(result).toContain("Appendix Section");
    expect(result).not.toContain("附录 A");
  });

  it("removes paragraph numbering", () => {
    const input = `# Title

## 1. Section

### 1.1. Subsection

1.1.1. Paragraph one.

1.1.2. Paragraph two.
`;
    const result = removeText(input);

    expect(result).toContain("Paragraph one");
    expect(result).toContain("Paragraph two");
    expect(result).not.toContain("1.1.1.");
    expect(result).not.toContain("1.1.2.");
  });

  it("preserves directive comments", () => {
    const input = `# Title

<!-- mmn: mainbody h -->

## 1. Section
`;
    const result = removeText(input);

    expect(result).toContain("<!-- mmn: mainbody h -->");
  });

  it("handles empty input", () => {
    const result = removeText("");
    expect(result).toBe("");
  });

  it("preserves frontmatter", () => {
    const input = `---
title: Test
---

# Title

## 1. Section
`;
    const result = removeText(input);
    expect(result).toContain("title: Test");
    expect(result).not.toContain("1. Section");
  });

  it("preserves content in code blocks", () => {
    const input = `# Title

## 1. Section

\`\`\`
1. This is code
2. Should not be removed
\`\`\`
`;
    const result = removeText(input);
    expect(result).toContain("1. This is code");
    expect(result).toContain("2. Should not be removed");
  });
});

describe("updateFile errors", () => {
  it("throws ExportError when file not found", async () => {
    await expect(updateFile("./non-existent-file.md")).rejects.toThrow(
      ExportError,
    );
    await expect(updateFile("./non-existent-file.md")).rejects.toThrow(
      "Failed to update file",
    );
  });
});

describe("removeFile errors", () => {
  it("throws ExportError when file not found", async () => {
    await expect(removeFile("./non-existent-file.md")).rejects.toThrow(
      ExportError,
    );
    await expect(removeFile("./non-existent-file.md")).rejects.toThrow(
      "Failed to remove file",
    );
  });
});

describe("table handling", () => {
  it("does not add numbering to GFM tables", () => {
    const input = `# Title

<!-- mmn: mainbody h -->

## Section

| a | b |
|---|---|
| 1 | 2 |
`;
    const result = updateText(input);
    expect(result).toContain("| a | b |");
    expect(result).toContain("| 1 | 2 |");
    expect(result).not.toContain("1. | a");
  });

  it("does not add numbering to table rows in h+p mode", () => {
    const input = `# Title

<!-- mmn: mainbody h+p -->

## Section

| a | b |
|---|---|
| 1 | 2 |

This is a real paragraph.
`;
    const result = updateText(input);
    expect(result).toContain("| a | b |");
    expect(result).toContain("1.1. This is a real paragraph");
  });
});

describe("math handling", () => {
  it("does not add numbering to math blocks", () => {
    const input = `# Title

<!-- mmn: mainbody h -->

## Section

$$
E = mc^2
$$
`;
    const result = updateText(input);
    expect(result).toContain("$$");
    expect(result).toContain("E = mc^2");
    expect(result).not.toContain("1. $$");
  });

  it("does not add numbering to math blocks in h+p mode", () => {
    const input = `# Title

<!-- mmn: mainbody h+p -->

## Section

$$
E = mc^2
$$

This is a real paragraph.
`;
    const result = updateText(input);
    expect(result).toContain("$$");
    expect(result).toContain("1.1. This is a real paragraph");
  });
});
