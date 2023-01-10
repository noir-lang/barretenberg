import { Prover } from '../prover';
import { BarretenbergWasm, WorkerPool } from '../../wasm';

export class StandardExampleProver {
  constructor(private prover: Prover) {}

  // We do not pass in a constraint_system to this method
  // so that users cannot call it twice and possibly be
  // in a state where they have a different circuit definition to
  // the proving key
  //
  //Ideally, we want this to be called in the constructor and not be manually called by users. Possibly create a .new method
  public async initCircuitDefinition(constraint_system: Uint8Array) {
    let worker = this.prover.getWorker();
    const constraint_system_ptr = await worker.call('bbmalloc', constraint_system.length);
    await worker.transferToHeap(constraint_system, constraint_system_ptr);

    await worker.call('standard_example__init_circuit_def', constraint_system_ptr);
  }

  public async computeKey() {
    const worker = this.prover.getWorker();
    await worker.call('standard_example__init_proving_key');
  }

  public async createProof(witness_arr: Uint8Array) {
    const worker = this.prover.getWorker();

    const witness_ptr = await worker.call('bbmalloc', witness_arr.length);
    await worker.transferToHeap(witness_arr, witness_ptr);

    const proverPtr = await worker.call('standard_example__new_prover', witness_ptr);
    const proof = await this.prover.createProof(proverPtr);
    await worker.call('standard_example__delete_prover', proverPtr);
    return proof;
  }

  public getProver() {
    return this.prover;
  }
}

export async function getCircuitSize(wasm: BarretenbergWasm, constraint_system: Uint8Array) {
  let pool = new WorkerPool();
  await pool.init(wasm.module, 8);
  let worker = pool.workers[0];

  const buf = Buffer.from(constraint_system);
  const mem = await worker.call('bbmalloc', buf.length);
  await worker.transferToHeap(buf, mem);

  const circSize = await worker.call('standard_example__get_circuit_size', mem);
  // FFT requires the circuit size to be a power of two.
  // If it is not, then we round it up to the nearest power of two
  if (powerOf2(circSize)) {
    return circSize;
  } else {
    return pow2ceil(circSize);
  }
}

// Returns true, if `v` is a power of two
function powerOf2(v) {
  return v && !(v & (v - 1));
}
// Rounds `v` up to the next power of two.
// Note: If `v` is already a power of two, it will still round `v`
// to the next power of two
function pow2ceil(v) {
  var p = 2;
  while ((v >>= 1)) {
    p <<= 1;
  }
  return p;
}
