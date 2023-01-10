export class JoinSplitVerifier {
    async computeKey(pippenger, g2Data) {
        this.worker = pippenger.getWorker(), await this.worker.transferToHeap(g2Data, 0), await this.worker.call('join_split__init_verification_key', pippenger.getPointer(), 0);
    }
    async getKey() {
        let keySize = await this.worker.call('join_split__get_new_verification_key_data', 0), keyPtr = Buffer.from(await this.worker.sliceMemory(0, 4)).readUInt32LE(0), buf = Buffer.from(await this.worker.sliceMemory(keyPtr, keyPtr + keySize));
        return await this.worker.call('bbfree', keyPtr), buf;
    }
    async loadKey(worker, keyBuf, g2Data) {
        this.worker = worker;
        let keyPtr = await this.worker.call('bbmalloc', keyBuf.length);
        await this.worker.transferToHeap(g2Data, 0), await this.worker.transferToHeap(keyBuf, keyPtr), await this.worker.call('join_split__init_verification_key_from_buffer', keyPtr, 0), await this.worker.call('bbfree', keyPtr);
    }
    async verifyProof(proof) {
        let proofPtr = await this.worker.call('bbmalloc', proof.length);
        await this.worker.transferToHeap(proof, proofPtr);
        let verified = !!await this.worker.call('join_split__verify_proof', proofPtr, proof.length);
        return await this.worker.call('bbfree', proofPtr), verified;
    }
}
