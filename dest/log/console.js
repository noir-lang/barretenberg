"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "createLogger", {
    enumerable: !0,
    get: ()=>createLogger
});
class ConsoleLogger {
    log(...args) {
        this.logger(`${this.prefix}:`, ...args);
    }
    constructor(prefix, logger = console.log){
        this.prefix = prefix, this.logger = logger;
    }
}
function createLogger(prefix) {
    if (prefix) {
        let logger = new ConsoleLogger(prefix, console.log);
        return (...args)=>logger.log(...args);
    }
    return console.log;
}
