// logger.js
// Structured frontend logger for MemoryVault.
//
// Usage:
//   import logger from '../services/logger';
//   logger.info('Login', 'User signed in', { email });
//
// DevTools helpers (browser console):
//   window.mvLogger.getLogs()       -- returns the in-memory log array
//   window.mvLogger.downloadLogs()  -- downloads mv_session.log

const LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
const LABELS = ['DEBUG', 'INFO', 'WARN', 'ERROR'];

const SESSION_KEY = 'mv_logs';
const MAX_BUFFER  = 500;

// Internal ring buffer
let buffer = [];

// Restore existing session logs on load
try {
  const stored = sessionStorage.getItem(SESSION_KEY);
  if (stored) buffer = JSON.parse(stored);
} catch (_) {
  buffer = [];
}

function persist() {
  try {
    // Keep only the last MAX_BUFFER entries
    if (buffer.length > MAX_BUFFER) buffer = buffer.slice(-MAX_BUFFER);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(buffer));
  } catch (_) {
    // sessionStorage quota: silently fail, buffer stays in memory
  }
}

function log(levelIndex, module, message, data) {
  const entry = {
    ts:      new Date().toISOString(),
    level:   LABELS[levelIndex],
    module:  module || 'App',
    message: String(message),
    data:    data !== undefined ? data : null,
  };

  buffer.push(entry);
  persist();

  // Console output with colour coding
  const prefix = `[${entry.ts}] [${entry.level}] [${entry.module}]`;
  if (levelIndex === LEVELS.ERROR) {
    console.error(prefix, message, data !== undefined ? data : '');
  } else if (levelIndex === LEVELS.WARN) {
    console.warn(prefix, message, data !== undefined ? data : '');
  } else if (levelIndex === LEVELS.DEBUG) {
    console.debug(prefix, message, data !== undefined ? data : '');
  } else {
    console.log(prefix, message, data !== undefined ? data : '');
  }
}

const logger = {
  debug: (module, message, data) => log(LEVELS.DEBUG, module, message, data),
  info:  (module, message, data) => log(LEVELS.INFO,  module, message, data),
  warn:  (module, message, data) => log(LEVELS.WARN,  module, message, data),
  error: (module, message, data) => log(LEVELS.ERROR, module, message, data),

  // Return a copy of the current buffer
  getLogs: () => [...buffer],

  // Download the current session log as a plain-text file
  downloadLogs: () => {
    const lines = buffer.map(e => {
      const dataStr = e.data !== null ? ' | data=' + JSON.stringify(e.data) : '';
      return `${e.ts} [${e.level}] [${e.module}] ${e.message}${dataStr}`;
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'mv_session.log';
    a.click();
    URL.revokeObjectURL(url);
  },
};

// Expose on window so DevTools can access it at any time
if (typeof window !== 'undefined') {
  window.mvLogger = logger;
}

export default logger;
