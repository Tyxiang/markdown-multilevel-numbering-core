# Markdown Multilevel Numbering (mmn) 

这是一个给 markdown 文档添加多级编号的工具，支持正文/附录两种编号模式，可通过指令灵活控制编号模式、深度。

## 1. 功能特性

- 正文模式标题和段落的编号：`1.`, `1.1.`, `1.1.1.` ...
- 附录模式标题和段落的编号：`A.`, `A.1.`, `A.1.1.` ...
- 附录的 H2 标题格式：`附录 A 标题`。
- 通过控制指令灵活改变编号行为。
- 一级标题永远不会参与编号。
- 只处理第一个一级标题逻辑范围内的内容，后续一级标题及其内容将被忽略。
- 基于 AST 的可靠解析，保护代码块、列表等内容不被误改。

## 2. 控制指令

在 markdown 文档中用 HTML 注释方式插入控制指令来控制编号行为。

注释格式：`<!-- mmn: command [command...] -->`

| command    | 功能描述                                               |
| ---------- | ------------------------------------------------------ |
| `mainbody` | 编号模式指令，以默认值开始正文模式编号，深度默认为 `h` |
| `appendix` | 编号模式指令，以默认值开始附录模式编号，深度默认为 `h` |
| `h`        | 编号深度指令，给所有级别标题编号                       |
| `h+p`      | 编号深度指令，给所有级别标题、段落编号                 |
| `h2`       | 编号深度指令，给 2 级标题编号                          |
| `h3`       | 编号深度指令，给 2~3 级标题编号                        |
| `h4`       | 编号深度指令，给 2~4 级标题编号                        |
| `h5`       | 编号深度指令，给 2~5 级标题编号                        |
| `h6`       | 编号深度指令，给 2~6 级标题编号                        |
| `end`      | 结束编号                                               |

程序启动后，默认以 `mainbody` 模式开始编号。

## 3. 使用示例

### 3.1. 示例 1：基本标题编号

输入：

```markdown
# 文档标题

<!-- mmn: mainbody h -->

## 引言

## 方法

### 实验设计

### 数据分析

## 结论
```

输出：

```markdown
# 文档标题

<!-- mmn: mainbody h -->

## 1. 引言

## 2. 方法

### 2.1. 实验设计

### 2.2. 数据分析

## 3. 结论
```

### 3.2. 示例 2：标题 + 段落编号

输入：

```markdown
# 文档标题

<!-- mmn: mainbody h+p -->

## 引言

这是第一段。

这是第二段。

## 方法

### 实验设计

实验步骤如下。

具体细节说明。
```

输出：

```markdown
# 文档标题

<!-- mmn: mainbody h+p -->

## 1. 引言

1.1. 这是第一段。

1.2. 这是第二段。

## 2. 方法

### 2.1. 实验设计

2.1.1. 实验步骤如下。

2.1.2. 具体细节说明。
```

### 3.3. 示例 4：动态调整编号深度

输入：

```markdown
# 文档标题

<!-- mmn: mainbody h2 -->

## 概述

### 这个三级标题不会编号

### 这个也不会

<!-- mmn: h -->

## 正文

### 现在开始编号了

#### 四级标题也会编号

内容不会被编号。
```

输出：

```markdown
# 文档标题

<!-- mmn: mainbody h2 -->

## 1. 概述

### 这个三级标题不会编号

### 这个也不会

<!-- mmn: h -->

## 2. 正文

### 2.1. 现在开始编号了

#### 2.1.1. 四级标题也会编号

但内容不会被编号。
```

### 3.4. 示例 3：正文 + 附录混合

输入：

```markdown
# 文档标题

<!-- mmn: mainbody h -->

## 引言

## 方法

<!-- mmn: appendix h -->

## 补充材料

### 原始数据

## 调查问卷
```

输出：

```markdown
# 文档标题

<!-- mmn: mainbody h -->

## 1. 引言

## 2. 方法

<!-- mmn: appendix h -->

## 附录 A 补充材料

### A.1. 原始数据

## 附录 B 调查问卷
```

### 3.5. 更完整编码逻辑示例

详见 `doc/numbering-logic-demo.md`

## 4. 实现思路

- 将 markdown 解析为 AST。
- 遍历元素：提取指令，增加编号（update）/ 删除编号（remove）。
- 将 AST 转换回 markdown。

## 5. 安装

使用 npm

```bash
npm install markdown-multilevel-numbering
```

使用 pnpm

```bash
pnpm add markdown-multilevel-numbering
```

## 6. 使用

```typescript
import {
  updateText,
  removeText,
  updateFile,
  removeFile,
} from "markdown-multilevel-numbering";

// 处理文本
const numbered = updateText(markdownContent);
const cleaned = removeText(numberedContent);

// 直接处理文件
await updateFile("./input.md");
await removeFile("./numbered.md");
```

## 7. License

MIT

