# Support triage — Perceive ? Plan ? Act

Tiny classroom demo. Stages are labeled in the console.

## Start (no API key)

```bash
cd support-triage-ppa && node demo.mjs
```

Happy path: **T-104** (checkout outage) ? **P0** ? **billing-oncall**.

## Optional (BDK playground, needs Cursor API key)

```bash
cd support-triage-ppa && npm i && npx bdk serve --dir . --mode single --dev
# open http://127.0.0.1:3000/playground
# prompt: Triage the support inbox using Perceive, then Plan, then Act.
```
