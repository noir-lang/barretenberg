import { serialise_acir_to_barrtenberg_circuit, compute_witnesses as compute_partial_witnesses_aztec } from '@noir-lang/aztec_backend';
import { Crs } from '../../crs';
import { PooledFft } from '../../fft';
import { PooledPippenger } from '../../pippenger';
import { BarretenbergWasm, WorkerPool } from '../../wasm';
import { Prover } from '../prover';
import { getCircuitSize, StandardExampleProver } from './standard_example_prover';
import { StandardExampleVerifier } from './standard_example_verifier';
export * from './standard_example_prover';
export * from './standard_example_verifier';
export async function setup_generic_prover_and_verifier(acir) {
    let serialised_circuit = serialise_acir_to_barrtenberg_circuit(acir), barretenberg = await BarretenbergWasm.new(), circSize = await getCircuitSize(barretenberg, serialised_circuit), crs = await load_crs(circSize), wasm = await BarretenbergWasm.new(), workerPool = await WorkerPool.new(wasm, 4), pippenger = new PooledPippenger(workerPool), fft = new PooledFft(workerPool);
    await fft.init(circSize), await pippenger.init(crs.getData());
    let prover = new Prover(workerPool.workers[0], pippenger, fft), standardExampleProver = new StandardExampleProver(prover);
    await standardExampleProver.initCircuitDefinition(serialised_circuit);
    let standardExampleVerifier = new StandardExampleVerifier();
    return await standardExampleProver.computeKey(), await standardExampleVerifier.computeKey(pippenger.pool[0], crs.getG2Data()), await standardExampleVerifier.computeSmartContract(pippenger.pool[0], crs.getG2Data(), serialised_circuit), Promise.all([
        standardExampleProver,
        standardExampleVerifier
    ]);
}
async function load_crs(circSize) {
    let crs = new Crs(circSize + 1);
    return await crs.download(), crs;
}
export async function create_proof(prover, acir, abi) {
    let witness_arr = await compute_partial_witnesses(acir, abi), proof = await prover.createProof(witness_arr);
    return proof;
}
export async function create_proof_with_witness(prover, witness_arr) {
    let proof = await prover.createProof(witness_arr);
    return proof;
}
export async function verify_proof(verifier, proof) {
    let verified = await verifier.verifyProof(proof);
    return verified;
}
async function compute_partial_witnesses(circuit, abi) {
    let values = [];
    for (let [_, v] of Object.entries(abi)){
        let entry_values = function AnyToHexStrs(any_object) {
            let values = [];
            if (Array.isArray(any_object)) for (let variable of any_object)values = values.concat(AnyToHexStrs(variable));
            else if ('string' == typeof any_object || any_object instanceof String) {
                if (isNaN(Number(any_object))) throw Error("strings can only be hexadecimal and must start with 0x");
                values.push(any_object);
            } else if (Number.isInteger(any_object)) {
                let number_hex = any_object.toString(16);
                number_hex.length % 2 == 0 ? values.push("0x" + number_hex) : values.push("0x0" + number_hex);
            } else throw Error("unknown object type in the abi");
            return values;
        }(v);
        values = values.concat(entry_values);
    }
    return compute_partial_witnesses_aztec(circuit, values);
}
