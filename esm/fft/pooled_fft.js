import { createDebugLogger } from '../log';
import { MemoryFifo } from '../fifo';
import { SingleFft } from './single_fft';
let debug = createDebugLogger('bb:fft');
export class PooledFft {
    async init(circuitSize) {
        let start = new Date().getTime();
        debug(`initializing fft of size: ${circuitSize}`), await Promise.all(this.ffts.map((f)=>f.init(circuitSize))), this.ffts.forEach((w)=>this.processJobs(w)), debug(`initialization took: ${new Date().getTime() - start}ms`);
    }
    async destroy() {
        this.queue.cancel(), await Promise.all(this.ffts.map((f)=>f.destroy()));
    }
    async processJobs(worker) {
        for(;;){
            let job = await this.queue.get();
            if (!job) break;
            let result = await (job.inverse ? worker.ifft(job.coefficients) : worker.fft(job.coefficients, job.constant));
            job.resolve(result);
        }
    }
    async fft(coefficients, constant) {
        return await new Promise((resolve)=>this.queue.put({
                coefficients,
                constant,
                inverse: !1,
                resolve
            }));
    }
    async ifft(coefficients) {
        return await new Promise((resolve)=>this.queue.put({
                coefficients,
                inverse: !0,
                resolve
            }));
    }
    constructor(pool){
        this.queue = new MemoryFifo(), this.ffts = pool.workers.map((w)=>new SingleFft(w));
    }
}
export class PooledFftFactory {
    async createFft(circuitSize) {
        if (!this.ffts[circuitSize]) {
            let fft = new PooledFft(this.workerPool);
            await fft.init(circuitSize), this.ffts[circuitSize] = fft;
        }
        return this.ffts[circuitSize];
    }
    async destroy() {
        await Promise.all(Object.values(this.ffts).map((fft)=>fft.destroy()));
    }
    constructor(workerPool){
        this.workerPool = workerPool, this.ffts = {};
    }
}
