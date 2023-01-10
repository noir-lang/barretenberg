"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "WorkerPool", {
    enumerable: !0,
    get: ()=>WorkerPool
});
const _log = require("../log"), _workerFactory = require("./worker_factory"), debug = (0, _log.createDebugLogger)('bb:worker_pool');
class WorkerPool {
    static async new(barretenberg, poolSize) {
        let pool = new WorkerPool();
        return await pool.init(barretenberg.module, poolSize), pool;
    }
    async init(module, poolSize) {
        debug(`creating ${poolSize} workers...`);
        let start = new Date().getTime();
        this.workers = await Promise.all(Array(poolSize).fill(0).map((_, i)=>(0, _workerFactory.createWorker)(`${i}`, module, 0 === i ? 10000 : 256))), debug(`created workers: ${new Date().getTime() - start}ms`);
    }
    async destroy() {
        await Promise.all(this.workers.map(_workerFactory.destroyWorker));
    }
    constructor(){
        this.workers = [];
    }
}
