# Roadmap

## Phase 0 — Foundation (now)
- [x] Create repo and baseline docs
- [ ] Define API contracts for wait + result envelope
- [ ] Define failure bundle schema

## Phase 1 — Reliability primitives
- [ ] Add `waitFor` endpoint/CLI surface for: visible, attached, hidden, text, url, load-state
- [ ] Add per-action timeout + retry policy controls
- [ ] Add explicit machine-readable failure reasons

## Phase 2 — Observability
- [ ] Add `debugBundle()` endpoint returning artifact paths
- [ ] Capture console/network/error summaries with timestamps
- [ ] Add compact run transcript export

## Phase 3 — Agent ergonomics
- [ ] Improve snapshot ref stability across non-destructive DOM updates
- [ ] Add map/canvas helpers (nearest marker, layer-aware click)
- [ ] Add OpenClaw preset profile (`agent` mode)

## Phase 4 — Security/ops
- [ ] Session-scoped auth tokens and role-based action allowlists
- [ ] Request budgets/rate limits per session
- [ ] Remote mode deployment hardening docs
