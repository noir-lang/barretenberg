export class Sha256 {
    hash(data) {
        let mem = this.wasm.call('bbmalloc', data.length + 32);
        this.wasm.transferToHeap(data, mem), this.wasm.call('sha256__hash', mem, data.length, mem + data.length);
        let result = Buffer.from(this.wasm.sliceMemory(mem + data.length, mem + data.length + 32));
        return this.wasm.call('bbfree', mem), result;
    }
    constructor(wasm){
        this.wasm = wasm;
    }
}
