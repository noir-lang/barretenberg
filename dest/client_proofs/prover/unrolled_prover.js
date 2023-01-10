"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "UnrolledProver", {
    enumerable: !0,
    get: ()=>UnrolledProver
});
const _prover = require("./prover");
class UnrolledProver extends _prover.Prover {
    constructor(wasm, pippenger, fft){
        super(wasm, pippenger, fft, 'unrolled_');
    }
}
