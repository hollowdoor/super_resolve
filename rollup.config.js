import buble from 'rollup-plugin-buble';
const deps = Object.keys(require('./package.json').dependencies);

export default {
  entry: 'src/index.js',
  external: deps,
  plugins: [ buble() ],
  targets: [
    { dest: 'dist/bundle.js', format: 'cjs' },
    { dest: 'dist/bundle.es.js', format: 'es' },
  ]
};
