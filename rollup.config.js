import typescript from "rollup-plugin-typescript2"
import commonjs from "rollup-plugin-commonjs"
import external from "rollup-plugin-peer-deps-external"
import resolve from "rollup-plugin-node-resolve"
import postcss from "rollup-plugin-postcss"

import pkg from "./package.json"

const plugins = [
  external(),
  postcss({
    extract: true,
    modules: true,
  }),
  resolve(),
  typescript({
    rollupCommonJSResolveHack: true,
    exclude: "**/__tests__/**",
    clean: true,
  }),
  commonjs({
    include: ["node_modules/**"],
    namedExports: {
      "node_modules/react/react.js": [
        "Children",
        "Component",
        "PropTypes",
        "createElement",
      ],
      "node_modules/react-dom/index.js": ["render"],
    },
  }),
]

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "umd",
        exports: "named",
        sourcemap: true,
        name: "PayHere",
      },
    ],
    plugins,
  },
  {
    input: "src/embed.ts",
    output: [
      {
        file: "dist/embed.js",
        format: "umd",
        exports: "named",
        sourcemap: true,
        name: "PayHere",
      },
    ],
    plugins,
  },
  {
    input: "src/react.tsx",
    output: [
      {
        file: "dist/react.js",
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
    ],
    plugins,
  },
]
