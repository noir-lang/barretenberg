"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    InterruptableSleep: ()=>InterruptableSleep,
    sleep: ()=>sleep
});
const _errors = require("../errors");
class InterruptableSleep {
    async sleep(ms) {
        let timeout;
        let promise = new Promise((resolve)=>timeout = setTimeout(()=>resolve(!1), ms));
        this.timeouts.push(timeout);
        let shouldThrow = await Promise.race([
            promise,
            this.interruptPromise
        ]);
        if (clearTimeout(timeout), this.timeouts.splice(this.timeouts.indexOf(timeout), 1), shouldThrow) throw new _errors.InterruptError('Interrupted.');
    }
    interrupt(sleepShouldThrow = !1) {
        this.interruptResolve(sleepShouldThrow), this.interruptPromise = new Promise((resolve)=>this.interruptResolve = resolve);
    }
    constructor(){
        this.interruptResolve = ()=>{}, this.interruptPromise = new Promise((resolve)=>this.interruptResolve = resolve), this.timeouts = [];
    }
}
function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
