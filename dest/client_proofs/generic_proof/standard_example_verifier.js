"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "StandardExampleVerifier", {
    enumerable: !0,
    get: ()=>StandardExampleVerifier
});
const _aztecBackend = require("@noir-lang/aztec_backend");
class StandardExampleVerifier {
    async computeKey(pippenger, g2Data) {
        this.worker = pippenger.getWorker(), await this.worker.transferToHeap(g2Data, 0), await this.worker.call('standard_example__init_verification_key', pippenger.getPointer(), 0);
    }
    async verifyProof(proof) {
        let proofPtr = await this.worker.call('bbmalloc', proof.length);
        await this.worker.transferToHeap(proof, proofPtr);
        let verified = !!await this.worker.call('standard_example__verify_proof', proofPtr, proof.length);
        return await this.worker.call('bbfree', proofPtr), verified;
    }
    async computeSmartContract(pippenger, g2Data, constraint_system) {
        let worker = pippenger.getWorker(), g2Ptr = await worker.call('bbmalloc', g2Data.length);
        await worker.transferToHeap(g2Data, g2Ptr);
        let buf = Buffer.from(constraint_system), mem = await worker.call('bbmalloc', buf.length);
        await worker.transferToHeap(buf, mem);
        let vkSize = await worker.call('composer__smart_contract', pippenger.getPointer(), g2Ptr, mem, 0), vkPtr = Buffer.from(await worker.sliceMemory(0, 4)).readUInt32LE(0), vkMethod = Buffer.from(await worker.sliceMemory(vkPtr, vkPtr + vkSize)).toString();
        vkMethod = vkMethod.slice(40), this.ethSmartContract = (0, _aztecBackend.eth_contract_from_cs)(vkMethod);
    }
    SmartContract() {
        return this.ethSmartContract;
    }
}
