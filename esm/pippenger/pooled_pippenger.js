import { SinglePippenger } from './single_pippenger';
import { createDebugLogger } from '../log';
let debug = createDebugLogger('bb:pippenger');
export class PooledPippenger {
    async init(crsData) {
        let start = new Date().getTime();
        debug(`initializing: ${new Date().getTime() - start}ms`), this.pool = await Promise.all(this.workerPool.workers.map(async (w)=>{
            let p = new SinglePippenger(w);
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
