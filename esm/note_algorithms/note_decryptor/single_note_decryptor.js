import { ViewingKey } from '../../viewing_key';
export class SingleNoteDecryptor {
    async batchDecryptNotes(keysBuf, privateKey) {
        let numKeys = keysBuf.length / ViewingKey.SIZE, mem = await this.worker.call('bbmalloc', keysBuf.length + privateKey.length);
        await this.worker.transferToHeap(keysBuf, mem), await this.worker.transferToHeap(privateKey, mem + keysBuf.length), await this.worker.call('notes__batch_decrypt_notes', mem, mem + keysBuf.length, numKeys, mem);
        let dataBuf = Buffer.from(await this.worker.sliceMemory(mem, mem + 73 * numKeys));
        return await this.worker.call('bbfree', mem), dataBuf;
    }
    constructor(worker){
        this.worker = worker;
    }
}
