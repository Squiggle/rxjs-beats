import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import html from "rollup-plugin-html";
import copy from "rollup-plugin-copy";

const commonPlugins = [
  resolve({
    customResolveOptions: {
      moduleDirectory: "node_modules"
    }
  }),
  babel({
    exclude: 'node_modules/**' // only transpile our source code
  })
];

export default [
  {
    input: 'src/main.js',
    output: {
      file: 'dist/bundle.js',
      format: 'cjs'
    },
    plugins: [
      ...commonPlugins,
      // allow importing of HTML templates
      html({
        include: "src/**/*.html",
        htmlMinifierOptions: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          conservativeCollapse: true,
          minifyJS: true
        }
      }),
      // copy static files
      copy({
        targets: [
          { src: "src/index.html", dest: "dist" },
          { src: "src/styles.css", dest: "dist" }
        ]
      })
    ]
  },
  {
    input: "src/workers/core/core.js",
    output: {
      file: "dist/core.js",
      format: "cjs"
    },
    plugins: [...commonPlugins]
  }
]