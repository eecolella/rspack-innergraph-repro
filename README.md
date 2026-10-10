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

## What triggers it

Reduced from a larger app, so some pieces look arbitrary. Each of these was tried on an earlier version of the project, with the same structure and different names.

Needed (removing any one makes the panic go away):

- the two empty modules re-exported through `export *` from `src/lib/feature/index.js`
- the `service.js` layer and the chain of unused imports down to `src/timeout.js`
- an unused import of an external package in `src/timeout.js` (`react` and `@microsoft/signalr` trigger it, `rxjs` and `lodash-es` do not)
- the entry must not use `widget`'s dependencies (importing `Base` in `src/index.js` avoids it)

Not needed: re-exporting through a helper barrel, exporting `widget`, what `createWidget` returns.

Related: replacing `react` with a package that does not exist panics the same way in the default build, instead of reporting `Module not found`.

Workaround: `optimization: { innerGraph: false }`.
