import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/main.tsx'],
    outDir: 'bin',
    clean: true,
    shims: true,
    dts: {
        entry: 'src/type-index.ts',
    },
    format: ['esm'],
})