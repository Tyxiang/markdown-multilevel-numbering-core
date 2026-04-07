# AGENTS.md

## Quick Commands

```bash
npm run build      # Compile TypeScript -> dist/
npm run dev        # Watch mode
npm test           # Vitest (watch)
npm test:run       # Vitest (single run, CI)
```

## Architecture

- **Entry**: `src/index.ts` exports `updateText`, `removeText`, `updateFile`, `removeFile`
- **Parser**: `src/parser/` - AST parse/serialize via remark, directive extraction
- **Numbering**: `src/numbering/` - state machine, numbering logic, strip logic
- **Tests**: `tests/` mirrors `src/` structure

## Key Constraints

- ESM only (`"type": "module"`, `NodeNext` resolution)
- Build required before publish (`dist/` is shipped)
- Tests use path aliases resolved via `vitest.config.ts`
- Publishes on GitHub release via `.github/workflows/publish.yml`

## Control Commands (Domain Logic)

HTML comment directives: `<!-- mmn: command [command...] -->`

- Modes: `mainbody` (1., 1.1.), `appendix` (A., A.1.)
- Depth: `h`, `h+p`, `h2`–`h6`
- `end` stops numbering

First H1 never numbered; only processes content until second H1.

## Gotchas

- Do not change module system (ESM is intentional for package)
- Test aliases map `.js` imports to `.ts` sources - keep in sync with `src/`
- `prepublishOnly` hook enforces build before npm publish
