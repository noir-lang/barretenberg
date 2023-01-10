"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _wasm = require("../../wasm"), _pooledPedersen = require("./pooled_pedersen"), _singlePedersen = require("./single_pedersen");
describe('pedersen', ()=>{
    let barretenberg;
    let values = [];
    beforeAll(async ()=>{
        await (barretenberg = new _wasm.BarretenbergWasm()).init();
        for(let i = 0; i < 4096; ++i){
            let v = Buffer.alloc(32, 0);
            v.writeUInt32LE(i, 0), values[i] = v;
        }
    }), it('hasher_consistency_and_benchmark', async ()=>{
        let singlePedersen = new _singlePedersen.SinglePedersen(barretenberg);
        await singlePedersen.init();
        let start1 = new Date().getTime(), singleResults = await singlePedersen.hashToTree(values), end1 = new Date().getTime() - start1, pool = await _wasm.WorkerPool.new(barretenberg, 4), pedersen = new _pooledPedersen.PooledPedersen(barretenberg, pool);
        await pedersen.init();
        let start2 = new Date().getTime(), poolResults = await pedersen.hashToTree(values), end2 = new Date().getTime() - start2;
        console.log(`Single hasher: ~${end1 / values.length}ms / value`), console.log(`Pooled hasher: ~${end2 / values.length}ms / value`), console.log(`Pooled improvement: ${(end1 / end2).toFixed(2)}x`), expect(poolResults).toEqual(singleResults), await pool.destroy();
    });
});
