"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "PooledNoteDecryptor", {
    enumerable: !0,
    get: ()=>PooledNoteDecryptor
});
const _viewingKey = require("../../viewing_key"), _singleNoteDecryptor = require("./single_note_decryptor");
class PooledNoteDecryptor {
    async batchDecryptNotes(keysBuf, privateKey) {
        let numKeys = keysBuf.length / _viewingKey.ViewingKey.SIZE, numKeysPerBatch = Math.max(1, Math.floor(numKeys / this.pool.length)), numBatches = Math.min(Math.ceil(numKeys / numKeysPerBatch), this.pool.length), remainingKeys = numKeys - numKeysPerBatch * numBatches, dataStart = 0, batches = [
            ...Array(numBatches)
        ].map((_, i)=>{
            let dataEnd = dataStart + (numKeysPerBatch + +(i < remainingKeys)) * _viewingKey.ViewingKey.SIZE, keys = keysBuf.slice(dataStart, dataEnd);
            return dataStart = dataEnd, keys;
        }), results = await Promise.all(batches.map((batch, i)=>this.pool[i].batchDecryptNotes(batch, privateKey)));
        return Buffer.concat(results);
    }
    constructor(workerPool){
        this.pool = [], this.pool = workerPool.workers.map((w)=>new _singleNoteDecryptor.SingleNoteDecryptor(w));
    }
}
