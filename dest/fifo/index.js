"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "MemoryFifo", {
    enumerable: !0,
    get: ()=>MemoryFifo
});
class MemoryFifo {
    length() {
        return this.items.length;
    }
    get(timeout) {
        return this.items.length ? Promise.resolve(this.items.shift()) : 0 === this.items.length && this.flushing ? Promise.resolve(null) : new Promise((resolve, reject)=>{
            this.waiting.push(resolve), timeout && setTimeout(()=>{
                let index = this.waiting.findIndex((r)=>r === resolve);
                if (index > -1) {
                    this.waiting.splice(index, 1);
                    let err = Error('Timeout getting item from queue.');
                    reject(err);
                }
            }, 1000 * timeout);
        });
    }
    put(item) {
        this.flushing || (this.waiting.length ? this.waiting.shift()(item) : this.items.push(item));
    }
    end() {
        this.flushing = !0, this.waiting.forEach((resolve)=>resolve(null));
    }
    cancel() {
        this.flushing = !0, this.items = [], this.waiting.forEach((resolve)=>resolve(null));
    }
    async process(handler) {
        try {
            for(;;){
                let item = await this.get();
                if (null === item) break;
                await handler(item);
            }
        } catch (err) {
            console.error('Queue handler exception:', err);
        }
    }
    constructor(){
        this.waiting = [], this.items = [], this.flushing = !1;
    }
}
