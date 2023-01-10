"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "Prover", {
    enumerable: !0,
    get: ()=>Prover
});
const _log = require("../../log"), debug = (0, _log.createDebugLogger)('bb:prover');
class Timer {
    mark(msg) {
        let diff = new Date().getTime() - this.start;
        debug(`${msg} (ms:${diff})`), this.start = new Date().getTime();
    }
    constructor(msg){
        debug(msg), this.start = new Date().getTime();
    }
}
class Prover {
    getWorker() {
        return this.wasm;
    }
    async proverCall(name, ...args) {
        return await this.wasm.call(this.callPrefix + name, ...args);
    }
    async createProof(proverPtr) {
        await this.wasm.acquire();
        try {
            let circuitSize = await this.proverCall('prover_get_circuit_size', proverPtr), timer = new Timer('enter createProof');
            await this.proverCall('prover_execute_preamble_round', proverPtr), timer.mark('preamble end'), await this.processProverQueue(proverPtr, circuitSize), timer.mark('first round start'), await this.proverCall('prover_execute_first_round', proverPtr), timer.mark('first round end'), await this.processProverQueue(proverPtr, circuitSize), timer.mark('second round start'), await this.proverCall('prover_execute_second_round', proverPtr), timer.mark('second round end'), await this.processProverQueue(proverPtr, circuitSize), timer.mark('third round start'), await this.proverCall('prover_execute_third_round', proverPtr), timer.mark('third round end'), await this.processProverQueue(proverPtr, circuitSize), timer.mark('fourth round start'), await this.proverCall('prover_execute_fourth_round', proverPtr), timer.mark('fourth round end'), await this.processProverQueue(proverPtr, circuitSize), timer.mark('fifth round start'), await this.proverCall('prover_execute_fifth_round', proverPtr), timer.mark('fifth round end'), timer.mark('sixth round start'), await this.proverCall('prover_execute_sixth_round', proverPtr), timer.mark('sixth round end'), await this.processProverQueue(proverPtr, circuitSize), timer.mark('done');
            let proofSize = await this.proverCall('prover_export_proof', proverPtr, 0), proofPtr = Buffer.from(await this.wasm.sliceMemory(0, 4)).readUInt32LE(0);
            return Buffer.from(await this.wasm.sliceMemory(proofPtr, proofPtr + proofSize));
        } finally{
            await this.wasm.release();
        }
    }
    async processProverQueue(proverPtr, circuitSize) {
        await this.proverCall('prover_get_work_queue_item_info', proverPtr, 0);
        let jobInfo = Buffer.from(await this.wasm.sliceMemory(0, 12)), scalarJobs = jobInfo.readUInt32LE(0), fftJobs = jobInfo.readUInt32LE(4), ifftJobs = jobInfo.readUInt32LE(8);
        debug(`starting jobs scalars:${scalarJobs} ffts:${fftJobs} iffts:${ifftJobs}`);
        for(let i = 0; i < scalarJobs; ++i){
            let scalarsPtr = await this.proverCall('prover_get_scalar_multiplication_data', proverPtr, i), scalars = await this.wasm.sliceMemory(scalarsPtr, scalarsPtr + 32 * circuitSize), result = await this.pippenger.pippengerUnsafe(scalars, 0, circuitSize);
            await this.wasm.transferToHeap(result, 0), await this.proverCall('prover_put_scalar_multiplication_data', proverPtr, 0, i);
        }
        let jobs = [];
        for(let i1 = 0; i1 < fftJobs; ++i1){
            let coeffsPtr = await this.proverCall('prover_get_fft_data', proverPtr, 0, i1), coefficients = await this.wasm.sliceMemory(coeffsPtr, coeffsPtr + 32 * circuitSize), constant = await this.wasm.sliceMemory(0, 32);
            jobs.push({
                coefficients,
                constant,
                inverse: !1,
                i: i1
            });
        }
        for(let i2 = 0; i2 < ifftJobs; ++i2){
            let coeffsPtr1 = await this.proverCall('prover_get_ifft_data', proverPtr, i2), coefficients1 = await this.wasm.sliceMemory(coeffsPtr1, coeffsPtr1 + 32 * circuitSize);
            jobs.push({
                coefficients: coefficients1,
                inverse: !0,
                i: i2
            });
        }
        await Promise.all(jobs.map(({ inverse , coefficients , constant , i  })=>inverse ? this.doIfft(proverPtr, i, circuitSize, coefficients) : this.doFft(proverPtr, i, circuitSize, coefficients, constant)));
    }
    async doFft(proverPtr, i, circuitSize, coefficients, constant) {
        let result = await this.fft.fft(coefficients, constant), resultPtr = await this.wasm.call('bbmalloc', 32 * circuitSize);
        await this.wasm.transferToHeap(result, resultPtr), await this.proverCall('prover_put_fft_data', proverPtr, resultPtr, i), await this.wasm.call('bbfree', resultPtr);
    }
    async doIfft(proverPtr, i, circuitSize, coefficients) {
        let result = await this.fft.ifft(coefficients), resultPtr = await this.wasm.call('bbmalloc', 32 * circuitSize);
        await this.wasm.transferToHeap(result, resultPtr), await this.proverCall('prover_put_ifft_data', proverPtr, resultPtr, i), await this.wasm.call('bbfree', resultPtr);
    }
    constructor(wasm, pippenger, fft, callPrefix = ''){
        this.wasm = wasm, this.pippenger = pippenger, this.fft = fft, this.callPrefix = callPrefix;
    }
}
