"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "PooledPippenger", {
    enumerable: !0,
    get: ()=>PooledPippenger
});
const _singlePippenger = require("./single_pippenger"), _log = require("../log"), debug = (0, _log.createDebugLogger)('bb:pippenger');
class PooledPippenger {
    async init(crsData) {
        let start = new Date().getTime();
        debug(`initializing: ${new Date().getTime() - start}ms`), this.pool = await Promise.all(this.workerPool.workers.map(async (w)=>{
            let p = new _singlePippenger.SinglePippenger(w);
            return await p.init(crsData), p;
        })), debug(`initialization took: ${new Date().getTime() - start}ms`);
    }
    async pippengerUnsafe(scalars, from, range) {
        let scalarsPerWorker = range / this.pool.length, start = new Date().getTime(), results = await Promise.all(this.pool.map((p, i)=>{
            let subset = scalars.slice(scalarsPerWorker * i * 32, scalarsPerWorker * (i + 1) * 32);
            return p.pippengerUnsafe(subset, scalarsPerWorker * i, scalarsPerWorker);
        }));
        return debug(`pippenger run took: ${new Date().getTime() - start}ms`), await this.sumElements(Buffer.concat(results));
    }
    async sumElements(buffer) {
        return await this.pool[0].sumElements(buffer);
    }
    constructor(workerPool){
        this.workerPool = workerPool, this.pool = [];
    }
}
