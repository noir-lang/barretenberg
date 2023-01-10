"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "SingleNoteDecryptor", {
    enumerable: !0,
    get: ()=>SingleNoteDecryptor
});
const _viewingKey = require("../../viewing_key");
class SingleNoteDecryptor {
    async batchDecryptNotes(keysBuf, privateKey) {
        let numKeys = keysBuf.length / _viewingKey.ViewingKey.SIZE, mem = await this.worker.call('bbmalloc', keysBuf.length + privateKey.length);
        await this.worker.transferToHeap(keysBuf, mem), await this.worker.transferToHeap(privateKey, mem + keysBuf.length), await this.worker.call('notes__batch_decrypt_notes', mem, mem + keysBuf.length, numKeys, mem);
        let dataBuf = Buffer.from(await this.worker.sliceMemory(mem, mem + 73 * numKeys));
        return await this.worker.call('bbfree', mem), dataBuf;
    }
    constructor(worker){
        this.worker = worker;
    }
}
