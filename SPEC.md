# OpenClaw-Oriented PinchTab Enhancement Spec (Draft)

## 1) Structured Action Result Envelope

Every action should return:

```json
{
  "ok": true,
  "action": "click",
  "durationMs": 84,
  "retryable": false,
  "reason": null,
  "artifacts": {
    "screenshot": null,
    "snapshot": null,
    "console": null,
    "network": null
  }
}
```

Failure example:

```json
{
  "ok": false,
  "action": "click",
  "durationMs": 30121,
  "retryable": true,
  "reason": "intercepted_pointer_events",
  "artifacts": {
    "screenshot": "/tmp/...png",
    "snapshot": "/tmp/...json",
    "console": "/tmp/...console.json",
    "network": "/tmp/...network.json"
  }
}
```

## 2) Wait Primitive Contract

`waitFor({ kind, value, timeoutMs })`

- `kind`: `visible|attached|hidden|text|url|load-state`
- Returns same result envelope.

## 3) Debug Bundle Contract

`debugBundle({ include })` where include can be:
- `snapshot`
- `screenshot`
- `console`
- `network`
- `errors`

Output should always include file paths and lightweight summaries.

## 4) Ref Stability Goal

Ref ids should be stable across DOM changes where element identity remains semantically equivalent.

Stability target:
- >95% ref persistence under non-structural updates.

## 5) OpenClaw preset

A preset named `openclaw-agent` should set:
- conservative timeouts,
- compact snapshot mode,
- deterministic action retries,
- debug bundle on failure,
- optional token-based auth guard.
