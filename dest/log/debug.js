"use strict";
let preLogHook, postLogHook;
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    createDebugLogger: ()=>createDebugLogger,
    setPreDebugLogHook: ()=>setPreDebugLogHook,
    setPostDebugLogHook: ()=>setPostDebugLogHook,
    enableLogs: ()=>enableLogs,
    isEnabled: ()=>isEnabled
});
const _debug = function(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}(require("debug"));
function createDebugLogger(name) {
    let logger = (0, _debug.default)(name);
    return (...args)=>(function(logger, ...args) {
            preLogHook && preLogHook(...args), logger(...args), postLogHook && postLogHook(...args);
        })(logger, ...args);
}
function setPreDebugLogHook(fn) {
    preLogHook = fn;
}
function setPostDebugLogHook(fn) {
    postLogHook = fn;
}
function enableLogs(str) {
    _debug.default.enable(str);
}
function isEnabled(str) {
    return _debug.default.enabled(str);
}
