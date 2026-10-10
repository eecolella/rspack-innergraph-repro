# rspack-innergraph-repro

Minimal reproduction for an Rspack panic in production builds: `should have module id`, with `optimization.innerGraph` on (the default in production mode). Valid JavaScript, a bare config, `react` as the only dependency. It works on `@rspack/core` 2.0.8 and earlier, and panics on 2.1.0 and later.

Layout follows [rspack-repro](https://github.com/web-infra-dev/rspack-repro): the bundler is selected with `RSPACK=1` / `WEBPACK=1` and the config is `rspack.config.mjs`.

## Usage

```sh
pnpm install

pnpm run build:rspack                  # panics: "should have module id" (innerGraph on, the default)
pnpm run build:rspack-no-inner-graph   # compiles successfully (output in ./rspack-dist-no-inner-graph)
pnpm run build:webpack                 # compiles successfully (output in ./webpack-dist)
```

`pnpm run build` runs all three in order and continues past the failure.

`@rspack/core` and `@rspack/cli` are pinned to 2.2.8; to try another version, change both in `package.json`.

## What the project contains

`src/lib/feature/index.js` re-exports two empty modules plus a factory (`export *`), `src/lib/index.js` calls the factory at module level for a value nothing imports, and `src/timeout.js` has an unused import of `react`. See the issue linked below for what is and isn't needed to trigger it.
