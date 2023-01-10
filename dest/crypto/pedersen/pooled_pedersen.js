"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "PooledPedersen", {
    enumerable: !0,
    get: ()=>PooledPedersen
});
const _singlePedersen = require("./single_pedersen");
class PooledPedersen extends _singlePedersen.SinglePedersen {
    async init() {
        await Promise.all(this.pool.map((p)=>p.init()));
    }
    async hashToTree(values) {
        var v;
        if (!((v = values.length) && !(v & v - 1))) throw Error('PooledPedersen::hashValuesToTree can only handle powers of 2.');
        let numWorkers = Math.min(values.length / 2, this.pool.length), workers = this.pool.slice(0, Math.max(numWorkers, 1)), numPerThread = values.length / workers.length, results = await Promise.all(workers.map((pedersen, i)=>pedersen.hashToTree(values.slice(i * numPerThread, (i + 1) * numPerThread)))), sliced = results.map((hashes)=>{
            let treeHashes = [];
            for(let i = numPerThread, j = 0; i >= 1; j += i, i /= 2)treeHashes.push(hashes.slice(j, j + i));
            return treeHashes;
        }), flattened = sliced[0];
        for(let i = 1; i < sliced.length; ++i)for(let j = 0; j < sliced[i].length; ++j)flattened[j] = [
            ...flattened[j],
            ...sliced[i][j]
        ];
        for(; flattened[flattened.length - 1].length > 1;){
            let lastRow = flattened[flattened.length - 1], newRow = [];
            for(let i1 = 0; i1 < lastRow.length; i1 += 2)newRow[i1 / 2] = this.pool[0].compress(lastRow[i1], lastRow[i1 + 1]);
            flattened.push(newRow);
        }
        return flattened.flat();
    }
    constructor(wasm, pool){
        super(wasm), this.pool = [], this.pool = pool.workers.map((w)=>new _singlePedersen.SinglePedersen(wasm, w));
    }
}
