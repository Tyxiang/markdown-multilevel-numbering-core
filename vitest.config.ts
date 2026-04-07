import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '../../src/index.js': path.resolve(__dirname, 'src/index.ts'),
      '../../src/parser/parse.js': path.resolve(__dirname, 'src/parser/parse.ts'),
      '../../src/parser/extract.js': path.resolve(__dirname, 'src/parser/extract.ts'),
      '../../src/numbering/state.js': path.resolve(__dirname, 'src/numbering/state.ts'),
      '../../src/numbering/apply.js': path.resolve(__dirname, 'src/numbering/apply.ts'),
      '../../src/utils/errors.js': path.resolve(__dirname, 'src/utils/errors.ts'),
    },
  },
})
