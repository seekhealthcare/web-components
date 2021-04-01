import babel from 'rollup-plugin-babel';
import del from 'rollup-plugin-delete';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';

import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';

import packageJson from './package.json';

const extensions = ['.js', '.ts', '.tsx'];

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    del({ targets: 'build/*' }),
    peerDepsExternal(),
    resolve({
      extensions
    }),
    typescript({
      typescript: require('typescript'),
      exclude: ['**/*.stories.tsx', '**/*.test.tsx']
    }),
    commonjs(),
    babel({
      extensions,
      exclude: /node_modules/,
      babelrc: true,
      runtimeHelpers: true
    }),
    postcss({
      extract: false,
      modules: true,
      use: ['sass']
    }),
    json({
      compact: true
    })
  ]
};
