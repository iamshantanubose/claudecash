import * as esbuild from 'esbuild'

const prod = process.argv.includes('--production')

await esbuild.build({
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  target: 'node18',
  sourcemap: !prod,
  minify: prod,
  logLevel: 'info',
})
