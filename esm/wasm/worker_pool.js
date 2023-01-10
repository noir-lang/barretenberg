import { createDebugLogger } from '../log';
import { createWorker, destroyWorker } from './worker_factory';
let debug = createDebugLogger('bb:worker_pool');
export class WorkerPool {
    static async new(barretenberg, poolSize) {
        let pool = new WorkerPool();
        return await pool.init(barretenberg.module, poolSize), pool;
    }
    async init(module, poolSize) {
        debug(`creating ${poolSize} workers...`);
        let start = new Date().getTime();
        this.workers = await Promise.all(Array(poolSize).fill(0).map((_, i)=>createWorker(`${i}`, module, 0 === i ? 10000 : 256))), debug(`created workers: ${new Date().getTime() - start}ms`);
    }
    async destroy() {
        await Promise.all(this.workers.map(destroyWorker));
    }
    constructor(){
        this.workers = [];
    }
}
