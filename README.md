# pinchtab-openclaw-enhancements

OpenClaw-first enhancement project for PinchTab reliability, observability, and agent ergonomics.

## Why this exists

For OpenClaw workflows, we need browser automation that is:
- token-efficient,
- deterministic under retries,
- remotely operable via structured APIs,
- easy to debug when things fail.

This repo tracks and prototypes those improvements.

## Initial focus areas

1. **Deterministic wait primitives** (`waitFor` visible/attached/text/url/load-state)
2. **Structured action result envelope** (`ok`, `reason`, `retryable`, `artifacts`)
3. **Failure debug bundle** (snapshot + screenshot + console + network summary)
4. **Session-scoped auth and role limits**
5. **Stable refs across snapshots**

## Plan

See `ROADMAP.md` and `SPEC.md`.

## Reference artifacts added

- `schemas/action-result.schema.json` — baseline result-envelope schema
- `schemas/wait-request.schema.json` — wait primitive request contract
- `schemas/debug-bundle.schema.json` — failure triage bundle contract
- `fixtures/action-success.json` / `fixtures/action-failure.json` — canonical action results
- `fixtures/wait-request.json` — canonical wait request
- `fixtures/debug-bundle.json` — canonical debug bundle output
- `tests/validate-fixtures.mjs` — lightweight schema-conformance harness

## Development

```bash
npm test
```

(Implementation code will be added incrementally as adapters/prototypes are built.)
