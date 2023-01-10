import { Transfer } from 'threads';
export class AccountProver {
    static getCircuitSize(proverless = !1) {
        return proverless ? 512 : 32768;
    }
    async computeKey() {
        let worker = this.prover.getWorker();
        await worker.call('account__init_proving_key', this.mock);
    }
    async loadKey(keyBuf) {
        let worker = this.prover.getWorker(), keyPtr = await worker.call('bbmalloc', keyBuf.length);
        await worker.transferToHeap(Transfer(keyBuf, [
            keyBuf.buffer
        ]), keyPtr), await worker.call('account__init_proving_key_from_buffer', keyPtr), await worker.call('bbfree', keyPtr);
    }
    async getKey() {
        let worker = this.prover.getWorker();
        await worker.acquire();
        try {
            let keySize = await worker.call('account__get_new_proving_key_data', 0), keyPtr = Buffer.from(await worker.sliceMemory(0, 4)).readUInt32LE(0), buf = Buffer.from(await worker.sliceMemory(keyPtr, keyPtr + keySize));
            return await worker.call('bbfree', keyPtr), buf;
        } finally{
            await worker.release();
        }
    }
    async computeSigningData(tx) {
        let worker = this.prover.getWorker();
        return await worker.transferToHeap(tx.toBuffer(), 0), await worker.call('account__compute_signing_data', 0, 0), Buffer.from(await worker.sliceMemory(0, 32));
    }
    async createAccountProof(tx, signature) {
        let worker = this.prover.getWorker(), buf = Buffer.concat([
            tx.toBuffer(),
            signature.toBuffer()
        ]), mem = await worker.call('bbmalloc', buf.length);
        await worker.transferToHeap(buf, mem);
        let proverPtr = await worker.call('account__new_prover', mem, this.mock);
        await worker.call('bbfree', mem);
        let proof = await this.prover.createProof(proverPtr);
        return await worker.call('account__delete_prover', proverPtr), proof;
    }
    getProver() {
        return this.prover;
    }
    constructor(prover, mock = !1){
        this.prover = prover, this.mock = mock;
    }
}
