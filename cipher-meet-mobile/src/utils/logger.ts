
let logs: string[] = [];
const MAX_LOGS = 100;
const listeners: Set<() => void> = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

export const Logger = {
  log: (...args: any[]) => {
    const message = args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ');
    const logEntry = `[LOG] ${new Date().toLocaleTimeString()}: ${message}`;
    logs.unshift(logEntry);
    if (logs.length > MAX_LOGS) logs.pop();
    originalConsoleLog(...args);
    notifyListeners();
  },
  warn: (...args: any[]) => {
    const message = args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ');
    const logEntry = `[WARN] ${new Date().toLocaleTimeString()}: ${message}`;
    logs.unshift(logEntry);
    if (logs.length > MAX_LOGS) logs.pop();
    originalConsoleWarn(...args);
    notifyListeners();
  },
  error: (...args: any[]) => {
    const message = args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ');
    const logEntry = `[ERROR] ${new Date().toLocaleTimeString()}: ${message}`;
    logs.unshift(logEntry);
    if (logs.length > MAX_LOGS) logs.pop();
    originalConsoleError(...args);
    notifyListeners();
  },
  getLogs: () => logs,
  clear: () => {
    logs = [];
    notifyListeners();
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

// Override console methods to capture logs automatically
console.log = Logger.log;
console.warn = Logger.warn;
console.error = Logger.error;
