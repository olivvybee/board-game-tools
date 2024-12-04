# Board game tools

The code that powers https://board-game-tools.app.

## Developing

The code is structured as a [`turbo`](https://turbo.build/repo) monorepo, with
dependencies managed with `pnpm`.

### Installing dependencies

Run `pnpm i` at the root of the repo.

### Running locally

To run just the frontend, `cd` into `frontend/` and run `pnpm dev`.

To run a single worker, `cd` into its directory (`workers/xyz`) and run
`pnpm dev`.

To run everything (the frontend and the workers), run `pnpm dev` at the root of
the repo.
