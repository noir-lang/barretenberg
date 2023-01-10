import { WorkerPool } from '../../wasm';
export class StandardExampleProver {
    async initCircuitDefinition(constraint_system) {
        let worker = this.prover.getWorker(), constraint_system_ptr = await worker.call('bbmalloc', constraint_system.length);
        await worker.transferToHeap(constraint_system, constraint_system_ptr), await worker.call('standard_example__init_circuit_def', constraint_system_ptr);
    }
    async computeKey() {
        let worker = this.prover.getWorker();
        await worker.call('standard_example__init_proving_key');
    }
    async createProof(witness_arr) {
        let worker = this.prover.getWorker(), witness_ptr = await worker.call('bbmalloc', witness_arr.length);
        await worker.transferToHeap(witness_arr, witness_ptr);
        let proverPtr = await worker.call('standard_example__new_prover', witness_ptr), proof = await this.prover.createProof(proverPtr);
        return await worker.call('standard_example__delete_prover', proverPtr), proof;
    }
    getProver() {
        return this.prover;
    }
    constructor(prover){
        this.prover = prover;
    }
}
export async function getCircuitSize(wasm, constraint_system) {
    let pool = new WorkerPool();
    await pool.init(wasm.module, 8);
    let worker = pool.workers[0], buf = Buffer.from(constraint_system), mem = await worker.call('bbmalloc', buf.length);
    await worker.transferToHeap(buf, mem);
    let circSize = await worker.call('standard_example__get_circuit_size', mem);
    return circSize && !(circSize & circSize - 1) ? circSize : function(v) {
        for(var p = 2; v >>= 1;)p <<= 1;
        return p;
    }(circSize);
}
