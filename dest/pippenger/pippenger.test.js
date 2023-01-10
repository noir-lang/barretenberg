"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _wasm = require("../wasm"), _crs = require("../crs"), _debug = function(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}(require("debug")), _workerFactory = require("../wasm/worker_factory"), debug = (0, _debug.default)('bb::pippenger_test');
describe('pippenger', ()=>{
    it('should not blow up', async ()=>{
        let wasm = await _wasm.BarretenbergWasm.new(), crs = new _crs.Crs(4096);
        await crs.download();
        let crsData = crs.getData(), crsPtr = wasm.exports().bbmalloc(crsData.length);
        wasm.transferToHeap(crsData, crsPtr);
        let pippengerPtr = wasm.exports().new_pippenger(crsPtr, 4096);
        wasm.exports().bbfree(crsPtr);
        let scalars = Buffer.alloc(131072), mem = wasm.exports().bbmalloc(scalars.length);
        wasm.transferToHeap(scalars, mem), wasm.exports().pippenger_unsafe(pippengerPtr, mem, 0, 4096, 0), wasm.exports().bbfree(mem), debug('mem:', wasm.memSize());
    }, 60000), it('should not blow up with worker', async ()=>{
        let wasm = await (0, _workerFactory.createWorker)('worker_test'), crs = new _crs.Crs(4096);
        await crs.download();
        let crsData = crs.getData(), crsPtr = await wasm.call('bbmalloc', crsData.length);
        await wasm.transferToHeap(crsData, crsPtr), await wasm.call('bbfree', crsPtr);
        let scalars = Buffer.alloc(131072), mem = await wasm.call('bbmalloc', scalars.length);
        await wasm.transferToHeap(scalars, mem), await wasm.call('bbfree', mem), debug('mem:', await wasm.memSize()), await (0, _workerFactory.destroyWorker)(wasm);
    }, 60000);
});
