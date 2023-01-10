import { Prover } from './prover';
export class UnrolledProver extends Prover {
    constructor(wasm, pippenger, fft){
        super(wasm, pippenger, fft, 'unrolled_');
    }
}
