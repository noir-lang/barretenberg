"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    SingleFft: ()=>SingleFft,
    SingleFftFactory: ()=>SingleFftFactory
});
const _threads = require("threads");
class SingleFft {
    async init(circuitSize) {
        this.domainPtr = await this.wasm.call('new_evaluation_domain', circuitSize);
    }
    async destroy() {
        await this.wasm.call('delete_evaluation_domain', this.domainPtr);
    }
    async fft(coefficients, constant) {
        let circuitSize = coefficients.length / 32, newPtr = await this.wasm.call('bbmalloc', coefficients.length);
        await this.wasm.transferToHeap((0, _threads.Transfer)(coefficients, [
            coefficients.buffer
        ]), newPtr), await this.wasm.transferToHeap((0, _threads.Transfer)(constant, [
            constant.buffer
        ]), 0), await this.wasm.call('coset_fft_with_generator_shift', newPtr, 0, this.domainPtr);
        let result = await this.wasm.sliceMemory(newPtr, newPtr + 32 * circuitSize);
        return await this.wasm.call('bbfree', newPtr), result;
    }
    async ifft(coefficients) {
        let circuitSize = coefficients.length / 32, newPtr = await this.wasm.call('bbmalloc', coefficients.length);
        await this.wasm.transferToHeap((0, _threads.Transfer)(coefficients, [
            coefficients.buffer
        ]), newPtr), await this.wasm.call('ifft', newPtr, this.domainPtr);
        let result = await this.wasm.sliceMemory(newPtr, newPtr + 32 * circuitSize);
        return await this.wasm.call('bbfree', newPtr), result;
    }
    constructor(wasm){
        this.wasm = wasm;
    }
}
class SingleFftFactory {
    async createFft(circuitSize) {
        if (!this.ffts[circuitSize]) {
            let fft = new SingleFft(this.wasm);
            await fft.init(circuitSize), this.ffts[circuitSize] = fft;
        }
        return this.ffts[circuitSize];
    }
    async destroy() {}
    constructor(wasm){
        this.wasm = wasm, this.ffts = {};
    }
}
