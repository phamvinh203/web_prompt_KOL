const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  red:    '\x1b[31m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  blue:   '\x1b[34m',
  cyan:   '\x1b[36m',
  white:  '\x1b[37m',
  gray:   '\x1b[90m',
};

function ts() {
  return C.gray + new Date().toTimeString().slice(0, 8) + C.reset;
}

function tag(label, color) {
  return color + C.bold + `[${label}]` + C.reset;
}

export function logInfo(scope, msg) {
  console.log(`${ts()} ${tag(scope, C.blue)}  ${msg}`);
}

export function logOk(scope, msg) {
  console.log(`${ts()} ${tag(scope, C.green)} ${C.green}✓${C.reset} ${msg}`);
}

export function logWarn(scope, msg) {
  console.log(`${ts()} ${tag(scope, C.yellow)} ${C.yellow}⚠${C.reset}  ${msg}`);
}

export function logErr(scope, msg) {
  console.log(`${ts()} ${tag(scope, C.red)}  ${C.red}✗${C.reset} ${msg}`);
}

export function logStep(scope, current, total, msg) {
  const bar = `${C.cyan}[${current}/${total}]${C.reset}`;
  console.log(`${ts()} ${tag(scope, C.cyan)}  ${bar} ${msg}`);
}

export function elapsed(startMs) {
  const ms = Date.now() - startMs;
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}
