import typescript from '@rollup/plugin-typescript';
import { exec } from 'child_process';


export default {
    input: 'src/main.tsx', // Entry file
    output: {
        banner: '#!/usr/bin/env node',
        file: 'bin/main.js', // Output bundle
        format: 'esm', // ESM
    },
    plugins: [
        typescript({
            tsconfig: 'tsconfig.rollup.json'
        }),
    ],
    external: ['react',  'use-immer'],
};
