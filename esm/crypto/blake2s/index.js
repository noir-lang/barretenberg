export class Blake2s {
    hashToField(data) {
        let mem = this.wasm.call('bbmalloc', data.length);
        return this.wasm.transferToHeap(data, mem), this.wasm.call('blake2s_to_field', mem, data.length, 0), this.wasm.call('bbfree', mem), Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    constructor(wasm){
        this.wasm = wasm;
    }
}
