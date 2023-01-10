class ConsoleLogger {
    log(...args) {
        this.logger(`${this.prefix}:`, ...args);
    }
    constructor(prefix, logger = console.log){
        this.prefix = prefix, this.logger = logger;
    }
}
export function createLogger(prefix) {
    if (prefix) {
        let logger = new ConsoleLogger(prefix, console.log);
        return (...args)=>logger.log(...args);
    }
    return console.log;
}
