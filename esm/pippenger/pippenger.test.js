import { BarretenbergWasm } from '../wasm';
import { Crs } from '../crs';
import createDebug from 'debug';
import { createWorker, destroyWorker } from '../wasm/worker_factory';
let debug = createDebug('bb::pippenger_test');
describe('pippenger', ()=>{
    it('should not blow up', async ()=>{
        let wasm = await BarretenbergWasm.new(), crs = new Crs(4096);
        await crs.download();
        let crsData = crs.getData(), crsPtr = wasm.exports().bbmalloc(crsData.length);
        wasm.transferToHeap(crsData, crsPtr);
        let pippengerPtr = wasm.exports().new_pippenger(crsPtr, 4096);
        wasm.exports().bbfree(crsPtr);
        let scalars = Buffer.alloc(131072), mem = wasm.exports().bbmalloc(scalars.length);
        wasm.transferToHeap(scalars, mem), wasm.exports().pippenger_unsafe(pippengerPtr, mem, 0, 4096, 0), wasm.exports().bbfree(mem), debug('mem:', wasm.memSize());
    }, 60000), it('should not blow up with worker', async ()=>{
        let wasm = await createWorker('worker_test'), crs = new Crs(4096);
        await crs.download();
        let crsData = crs.getData(), crsPtr = await wasm.call('bbmalloc', crsData.length);
        await wasm.transferToHeap(crsData, crsPtr), await wasm.call('bbfree', crsPtr);
        let scalars = Buffer.alloc(131072), mem = await wasm.call('bbmalloc', scalars.length);
        await wasm.transferToHeap(scalars, mem), await wasm.call('bbfree', mem), debug('mem:', await wasm.memSize()), await destroyWorker(wasm);
    }, 60000);
});
