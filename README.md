# VENU

An Oracle JET 21 virtual DOM app themed with Redwood. It implements the VENU events product from [techcomm.dev/venu](https://www.techcomm.dev/venu/) as a plausible Oracle Cloud application.

Live: [app.techcomm.dev](https://app.techcomm.dev)

There is no checkout. You search events, claim guest-list tickets, and transfer them when plans change.

## Local development

```bash
cd venu
npm install
npx ojet serve
```

## Production build

```bash
cd venu
npx ojet build --release
```

The static site is written to `venu/web`.
