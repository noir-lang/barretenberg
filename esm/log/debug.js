let preLogHook, postLogHook;
import debug from 'debug';
export function createDebugLogger(name) {
    let logger = debug(name);
    return (...args)=>(function(logger, ...args) {
            preLogHook && preLogHook(...args), logger(...args), postLogHook && postLogHook(...args);
        })(logger, ...args);
}
export function setPreDebugLogHook(fn) {
    preLogHook = fn;
}
export function setPostDebugLogHook(fn) {
    postLogHook = fn;
}
export function enableLogs(str) {
    debug.enable(str);
}
export function isEnabled(str) {
    return debug.enabled(str);
}
