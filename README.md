# Friedman & Singhal

A small greeting at [friedmanandsinghal.com](https://friedmanandsinghal.com/),
inspired by the typography and night-sky background of
[Adi's personal website](https://adityasinghal.com/).

The page is responsive, contains no tracking, and keeps its greeting visible
without JavaScript.

Click or tap any part of the greeting to reveal the anniversary surprise. The
celebration also works with a keyboard and respects reduced-motion preferences.
On November 1, 2026 in New York, it says "Happy Anniversary!!!". On every other
date it says "Wedding details will be here soon!".

## Development

Use Node.js 26 LTS and the pnpm version pinned in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm check
pnpm test
pnpm build
pnpm preview
```

The site uses Vite, strict TypeScript, plain CSS, and self-hosted Source Sans Pro.
Confetti loads only when the greeting is activated. Dependencies are pinned in
the lockfile, and Dependabot checks for updates weekly.

## Deployment

Pushing to `main` runs formatting, lint, type, date-boundary tests, build, and
production dependency checks. GitHub Actions publishes only `dist/` to GitHub
Pages. Actions are pinned to commit hashes and deployment uses GitHub's
short-lived credentials.

The custom domain is configured by `public/CNAME`. Porkbun DNS points the apex
and `www` to `adityaarunsinghal.github.io`. Registrar credentials belong in the
operating system's keychain, never in this repository.
