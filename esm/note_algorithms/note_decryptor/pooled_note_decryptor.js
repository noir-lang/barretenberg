import { ViewingKey } from '../../viewing_key';
import { SingleNoteDecryptor } from './single_note_decryptor';
export class PooledNoteDecryptor {
    async batchDecryptNotes(keysBuf, privateKey) {
        let numKeys = keysBuf.length / ViewingKey.SIZE, numKeysPerBatch = Math.max(1, Math.floor(numKeys / this.pool.length)), numBatches = Math.min(Math.ceil(numKeys / numKeysPerBatch), this.pool.length), remainingKeys = numKeys - numKeysPerBatch * numBatches, dataStart = 0, batches = [
            ...Array(numBatches)
        ].map((_, i)=>{
            let dataEnd = dataStart + (numKeysPerBatch + +(i < remainingKeys)) * ViewingKey.SIZE, keys = keysBuf.slice(dataStart, dataEnd);
            return dataStart = dataEnd, keys;
        }), results = await Promise.all(batches.map((batch, i)=>this.pool[i].batchDecryptNotes(batch, privateKey)));
        return Buffer.concat(results);
    }
    constructor(workerPool){
        this.pool = [], this.pool = workerPool.workers.map((w)=>new SingleNoteDecryptor(w));
    }
}
