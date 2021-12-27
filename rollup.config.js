import { babel } from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import globals from 'rollup-plugin-node-globals';
import pkg from './package.json';

const input = 'src/index.ts';
const extensions = ['.ts'];
const deps = [].concat(pkg.dependencies ? Object.keys(pkg.dependencies) : []);

function configure(env, target) {
  const isModule = target === 'module';
  const isCommonJs = target === 'cjs';

  const plugins = [
    typescript({
      abortOnError: false,
      tsconfig: './tsconfig.json',
      // COMPAT: Without this flag sometimes the declarations are not updated.
      // clean: isProd ? true : false,
      clean: true,
    }),

    // Use Babel to transpile the result, limiting it to the source code.
    babel({
      babelHelpers: 'runtime',
      include: ['src/**'],
      extensions,
      presets: [
        '@babel/preset-typescript',
        [
          '@babel/preset-env',
          {
            exclude: ['@babel/plugin-transform-regenerator', '@babel/transform-async-to-generator'],
            modules: false,
            targets: {
              esmodules: isModule,
            },
          },
        ],
      ],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            regenerator: false,
            useESModules: isModule,
          },
        ],
      ],
    }),

    // Register Node.js globals for browserify compatibility.
    globals(),
  ].filter(Boolean);

  if (isCommonJs) {
    return {
      plugins,
      input,
      output: [
        {
          file: pkg.main,
          format: 'cjs',
          exports: 'named',
          sourcemap: true,
        },
      ],
      external: (id) => {
        return !!deps.find((dep) => dep === id || id.startsWith(`${dep}/`));
      },
    };
  }

  if (isModule) {
    return {
      plugins,
      input,
      output: [
        {
          file: pkg.module,
          format: 'es',
          sourcemap: true,
        },
      ],
      external: (id) => {
        return !!deps.find((dep) => dep === id || id.startsWith(`${dep}/`));
      },
    };
  }
}

export default [configure('development', 'cjs'), configure('development', 'module')].filter(
  Boolean,
);
