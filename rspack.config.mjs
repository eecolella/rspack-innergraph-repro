import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isRunningWebpack = !!process.env.WEBPACK;
const isRunningRspack = !!process.env.RSPACK;
if (!isRunningRspack && !isRunningWebpack) {
  throw new Error("Unknown bundler");
}

const outputDir = isRunningWebpack
  ? "webpack-dist"
  : process.env.NO_INNER_GRAPH
    ? "rspack-dist-no-inner-graph"
    : "rspack-dist";

/**
 * @type {import('webpack').Configuration | import('@rspack/cli').Configuration}
 */
const config = {
  mode: "production",
  devtool: false,
  entry: {
    main: "./src/index.js",
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, outputDir),
    filename: "[name].js",
  },
  optimization: {
    minimize: false,
    // innerGraph is on by default in production mode
    ...(isRunningRspack && process.env.NO_INNER_GRAPH ? { innerGraph: false } : {}),
  },
};

export default config;
