"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "Blake2s", {
    enumerable: !0,
    get: ()=>Blake2s
});
class Blake2s {
    hashToField(data) {
        let mem = this.wasm.call('bbmalloc', data.length);
        return this.wasm.transferToHeap(data, mem), this.wasm.call('blake2s_to_field', mem, data.length, 0), this.wasm.call('bbfree', mem), Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    constructor(wasm){
        this.wasm = wasm;
    }
}
