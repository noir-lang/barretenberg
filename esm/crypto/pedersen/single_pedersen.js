import { deserializeArrayFromVector, deserializeField, serializeBufferArrayToVector } from '../../serialize';
export class SinglePedersen {
    async init() {
        this.wasm.call('pedersen__init'), await this.worker.call('pedersen__init');
    }
    compress(lhs, rhs) {
        return this.wasm.transferToHeap(lhs, 0), this.wasm.transferToHeap(rhs, 32), this.wasm.call('pedersen__compress_fields', 0, 32, 64), Buffer.from(this.wasm.sliceMemory(64, 96));
    }
    compressInputs(inputs) {
        let inputVectors = serializeBufferArrayToVector(inputs);
        return this.wasm.transferToHeap(inputVectors, 0), this.wasm.call('pedersen__compress', 0, 0), Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    compressWithHashIndex(inputs, hashIndex) {
        let inputVectors = serializeBufferArrayToVector(inputs);
        return this.wasm.transferToHeap(inputVectors, 0), this.wasm.call('pedersen__compress_with_hash_index', 0, 0, hashIndex), Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    hashToField(data) {
        let mem = this.wasm.call('bbmalloc', data.length);
        return this.wasm.transferToHeap(data, mem), this.wasm.call('pedersen__buffer_to_field', mem, data.length, 0), this.wasm.call('bbfree', mem), Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    async hashToTree(values) {
        let data = serializeBufferArrayToVector(values), inputPtr = await this.worker.call('bbmalloc', data.length);
        await this.worker.transferToHeap(data, inputPtr);
        let resultPtr = await this.worker.call('pedersen__hash_to_tree', inputPtr), resultNumFields = Buffer.from(await this.worker.sliceMemory(resultPtr, resultPtr + 4)).readUInt32BE(0), resultData = Buffer.from(await this.worker.sliceMemory(resultPtr, resultPtr + 4 + 32 * resultNumFields));
        return await this.worker.call('bbfree', inputPtr), await this.worker.call('bbfree', resultPtr), deserializeArrayFromVector(deserializeField, resultData).elem;
    }
    constructor(wasm, worker = wasm){
        this.wasm = wasm, this.worker = worker;
    }
}
