import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const actionSchema = JSON.parse(
  fs.readFileSync(path.join(root, 'schemas/action-result.schema.json'), 'utf8')
);
const waitSchema = JSON.parse(
  fs.readFileSync(path.join(root, 'schemas/wait-request.schema.json'), 'utf8')
);
const debugSchema = JSON.parse(
  fs.readFileSync(path.join(root, 'schemas/debug-bundle.schema.json'), 'utf8')
);

const fixtures = [
  ['fixtures/action-success.json', 'action', true],
  ['fixtures/action-failure.json', 'action', true],
  ['fixtures/wait-request.json', 'wait', true],
  ['fixtures/debug-bundle.json', 'debug', true]
];

function validateActionEnvelope(schema, data) {
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

function validateWaitRequest(schema, data) {
  for (const key of schema.required) {
    if (!(key in data)) return `missing required field: ${key}`;
  }
  if (!schema.properties.kind.enum.includes(data.kind)) return 'kind must be a supported wait kind';
  if (typeof data.value !== 'string' || !data.value.trim()) return 'value must be non-empty string';
  if (!Number.isInteger(data.timeoutMs) || data.timeoutMs < 1) return 'timeoutMs must be integer >= 1';
  return null;
}

function validateDebugBundle(schema, data) {
  for (const key of schema.required) {
    if (!(key in data)) return `missing required field: ${key}`;
  }
  if (typeof data.ok !== 'boolean') return 'ok must be boolean';
  if (typeof data.bundleId !== 'string' || !data.bundleId.trim()) return 'bundleId must be non-empty string';
  if (typeof data.generatedAt !== 'string' || !data.generatedAt.trim()) return 'generatedAt must be non-empty string';

  const artifacts = data.artifacts;
  if (!artifacts || typeof artifacts !== 'object') return 'artifacts must be object';
  for (const field of ['snapshot', 'screenshot', 'console', 'network', 'errors']) {
    if (!(field in artifacts)) return `artifacts missing field: ${field}`;
    const v = artifacts[field];
    if (!(typeof v === 'string' || v === null)) return `artifacts.${field} must be string|null`;
  }

  const summary = data.summary;
  if (!summary || typeof summary !== 'object') return 'summary must be object';
  for (const field of ['consoleCount', 'networkCount', 'errorCount']) {
    if (!Number.isInteger(summary[field]) || summary[field] < 0) {
      return `summary.${field} must be integer >= 0`;
    }
  }

  return null;
}

function validateByType(type, data) {
  if (type === 'action') return validateActionEnvelope(actionSchema, data);
  if (type === 'wait') return validateWaitRequest(waitSchema, data);
  if (type === 'debug') return validateDebugBundle(debugSchema, data);
  return `unknown validation type: ${type}`;
}

let failed = 0;
for (const [fixturePath, type, expectedPass] of fixtures) {
  const full = path.join(root, fixturePath);
  const data = JSON.parse(fs.readFileSync(full, 'utf8'));
  const err = validateByType(type, data);
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
