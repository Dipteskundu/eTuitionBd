/**
 * Error Suppressor Utility
 * Filters out browser extension errors from the console during development
 */

// Store the original console methods
const originalError = console.error;
const originalWarn = console.warn;

// List of patterns to suppress (browser extension related)
const suppressPatterns = [
    /polyfill\.js/i,
    /Could not establish connection/i,
    /Receiving end does not exist/i,
    /chrome-extension:\/\//i,
    /wrappedSendMessageCallback/i,
    /Cannot read properties of undefined.*reading 'options'/i,
];

/**
 * Check if an error message should be suppressed
 */
const shouldSuppress = (args) => {
    const message = args.join(' ');
    return suppressPatterns.some(pattern => pattern.test(message));
};

/**
 * Initialize error suppression
 * Call this in your main.jsx to filter out extension errors
 */
export const initErrorSuppressor = () => {
    // Override console.error
    console.error = (...args) => {
        if (!shouldSuppress(args)) {
            originalError.apply(console, args);
        }
    };

    // Override console.warn
    console.warn = (...args) => {
        if (!shouldSuppress(args)) {
            originalWarn.apply(console, args);
        }
    };

    // Suppress unhandled promise rejections from extensions
    window.addEventListener('unhandledrejection', (event) => {
        if (shouldSuppress([event.reason?.message || event.reason])) {
            event.preventDefault();
        }
    });

    // Suppress global errors from extensions
    window.addEventListener('error', (event) => {
        if (shouldSuppress([event.message])) {
            event.preventDefault();
        }
    });
};

/**
 * Restore original console methods
 * Useful for debugging when you need to see all errors
 */
export const restoreConsole = () => {
    console.error = originalError;
    console.warn = originalWarn;
};

export default initErrorSuppressor;
