import { InterruptError } from '../errors';
export class InterruptableSleep {
    async sleep(ms) {
        let timeout;
        let promise = new Promise((resolve)=>timeout = setTimeout(()=>resolve(!1), ms));
        this.timeouts.push(timeout);
        let shouldThrow = await Promise.race([
            promise,
            this.interruptPromise
        ]);
        if (clearTimeout(timeout), this.timeouts.splice(this.timeouts.indexOf(timeout), 1), shouldThrow) throw new InterruptError('Interrupted.');
    }
    interrupt(sleepShouldThrow = !1) {
        this.interruptResolve(sleepShouldThrow), this.interruptPromise = new Promise((resolve)=>this.interruptResolve = resolve);
    }
    constructor(){
        this.interruptResolve = ()=>{}, this.interruptPromise = new Promise((resolve)=>this.interruptResolve = resolve), this.timeouts = [];
    }
}
export function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
