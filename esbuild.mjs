import * as esbuild from 'esbuild'

const libraryBundleConfig = {
    entryPoints: ['src/main.tsx'],
    platform: 'node',
    tsconfig: 'tsconfig.json',
    bundle: true,
    packages: 'external'
}

// Build for esm
await esbuild.build({
    ...libraryBundleConfig,
    outfile: 'bin/main.js',
    format:'esm',
    banner: {js: '#!/usr/bin/env node'}
})