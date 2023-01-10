"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    backoffGenerator: ()=>backoffGenerator,
    retry: ()=>retry,
    retryUntil: ()=>retryUntil
});
const _sleep = require("../sleep"), _timer = require("../timer");
function* backoffGenerator() {
    let v = [
        1,
        1,
        1,
        2,
        4,
        8,
        16,
        32,
        64
    ], i = 0;
    for(;;)yield v[Math.min(i++, v.length - 1)];
}
async function retry(fn, name = 'Operation', backoff = backoffGenerator()) {
    for(;;)try {
        return await fn();
    } catch (err) {
        let s = backoff.next().value;
        if (void 0 === s) throw err;
        console.log(`${name} failed. Will retry in ${s}s...`), console.log(err), await (0, _sleep.sleep)(1000 * s);
        continue;
    }
}
async function retryUntil(fn, name = '', timeout = 0, interval = 1) {
    let timer = new _timer.Timer();
    for(;;){
        if (await fn()) return;
        if (await (0, _sleep.sleep)(1000 * interval), timeout && timer.s() > timeout) throw Error(name ? `Timeout awaiting ${name}` : 'Timeout');
    }
}
