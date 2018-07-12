import resolve from "rollup-plugin-node-resolve";
import filesize from "rollup-plugin-filesize";
import uglify from "rollup-plugin-uglify";
import babel from "rollup-plugin-babel";

export default [
  {
    input: "./lib/index.js",
    output: {
      file: "./dist/cratebox-react.js",
      format: "cjs",
      globals: {
        react: "React",
        "prop-types": "PropTypes",
      },
    },
    external: ["react", "prop-types"],
    plugins: [resolve(), babel(), filesize()],
  },
  {
    input: "./lib/index.js",
    output: {
      file: "./dist/cratebox-react.umd.js",
      format: "umd",
      name: "CrateboxReact",
      globals: {
        react: "React",
        "prop-types": "PropTypes",
      },
    },
    external: ["react", "prop-types"],
    plugins: [resolve(), babel(), uglify(), filesize()],
  },
  {
    input: "./lib/index.js",
    output: {
      file: "./dist/cratebox-react.module.js",
      format: "es",
      globals: {
        react: "React",
        "prop-types": "PropTypes",
      },
    },
    external: ["react", "prop-types"],
    plugins: [resolve(), babel(), filesize()],
  },
];
