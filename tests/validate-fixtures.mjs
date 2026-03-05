import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const schema = JSON.parse(
  fs.readFileSync(path.join(root, 'schemas/action-result.schema.json'), 'utf8')
);

const fixtures = [
  ['fixtures/action-success.json', true],
  ['fixtures/action-failure.json', true]
];

function validateEnvelope(data) {
  const required = schema.required;
  for (const key of required) {
    if (!(key in data)) return `missing required field: ${key}`;
  }

  if (typeof data.ok !== 'boolean') return 'ok must be boolean';
  if (typeof data.action !== 'string' || !data.action.trim()) return 'action must be non-empty string';
  if (!Number.isInteger(data.durationMs) || data.durationMs < 0) return 'durationMs must be integer >= 0';
  if (typeof data.retryable !== 'boolean') return 'retryable must be boolean';
  if (!(typeof data.reason === 'string' || data.reason === null)) return 'reason must be string|null';

  const a = data.artifacts;
  if (!a || typeof a !== 'object') return 'artifacts must be object';
  for (const field of ['screenshot', 'snapshot', 'console', 'network']) {
    if (!(field in a)) return `artifacts missing field: ${field}`;
    const v = a[field];
    if (!(typeof v === 'string' || v === null)) return `artifacts.${field} must be string|null`;
  }

  return null;
}

let failed = 0;
for (const [fixturePath, expectedPass] of fixtures) {
  const full = path.join(root, fixturePath);
  const data = JSON.parse(fs.readFileSync(full, 'utf8'));
  const err = validateEnvelope(data);
  const pass = !err;
  if (pass !== expectedPass) {
    failed += 1;
    console.error(`✗ ${fixturePath}: ${err || 'unexpected pass/fail'}`);
  } else {
    console.log(`✓ ${fixturePath}`);
  }
}

if (failed > 0) process.exit(1);
console.log('All fixture validations passed.');
