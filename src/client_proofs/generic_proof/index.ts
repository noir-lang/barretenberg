// TODO: fix this typo of barretenberg spelling
import {
  serialise_acir_to_barrtenberg_circuit,
  compute_witnesses as compute_partial_witnesses_aztec,
  eth_contract_from_cs,
} from '@noir-lang/aztec_backend';
import { Crs } from '../../crs';
import { PooledFft } from '../../fft';
import { PooledPippenger } from '../../pippenger';
import { BarretenbergWasm, WorkerPool } from '../../wasm';
import { Prover } from '../prover';
import { getCircuitSize, StandardExampleProver } from './standard_example_prover';
import { StandardExampleVerifier } from './standard_example_verifier';

export * from './standard_example_prover';
export * from './standard_example_verifier';


// Takes in a structure representing ACIR which we get from
// wasm version of the noir compiler
//
// We then serialise the ACIR into a byte array which represents
// what is known as standard_format in the C++ code.
//
// standard_format is capable of representing any statement.
//
// Note this byte array would be analogous to the `tx` structures
// in the other client proofs
export async function setup_generic_prover_and_verifier(acir: any) {
  
  const serialised_circuit = serialise_acir_to_barrtenberg_circuit(acir);

  const barretenberg = await BarretenbergWasm.new();

  const circSize = await getCircuitSize(barretenberg, serialised_circuit);

  const crs = await load_crs(circSize);

  const numWorkers = getNumCores();

  const wasm = await BarretenbergWasm.new();
  const workerPool = await WorkerPool.new(wasm, numWorkers);
  const pippenger = new PooledPippenger(workerPool);

  const fft = new PooledFft(workerPool);
  await fft.init(circSize);

  await pippenger.init(crs.getData());

  const prover = new Prover(workerPool.workers[0], pippenger, fft);

  const standardExampleProver = new StandardExampleProver(prover);
  await standardExampleProver.initCircuitDefinition(serialised_circuit);
  const standardExampleVerifier = new StandardExampleVerifier();

  // Create proving key with a dummy CRS
  await standardExampleProver.computeKey();
  // Create verifier key *and* patch proving key with the CRS
  await standardExampleVerifier.computeKey(pippenger.pool[0], crs.getG2Data());

  // Compute smart contract and cache it
  await standardExampleVerifier.computeSmartContract(pippenger.pool[0], crs.getG2Data(), serialised_circuit);

  return Promise.all([standardExampleProver, standardExampleVerifier]);
}

async function load_crs(circSize: number) {
  // We may need more elements in the SRS than the circuit size. In particular, we may need circSize +1
  // We add an offset here to account for that
  const offset = 1;

  const crs = new Crs(circSize + offset);
  await crs.download();

  return crs;
}

export async function create_proof(prover, acir, abi) {
  // compute partial witness here
  let witness_arr = await compute_partial_witnesses(acir, abi);
  // computes the proof
  const proof = await prover.createProof(witness_arr);

  return proof;
}

export async function create_proof_with_witness(prover, witness_arr) {
  // computes the proof
  const proof = await prover.createProof(witness_arr);

  return proof;
}

export async function verify_proof(verifier, proof) {
  const verified = await verifier.verifyProof(proof);
  return verified;
}

async function compute_partial_witnesses(circuit: any, abi: any) {
  // Use the ACIR representation to compute the partial witnesses


  // Assumption: .values() will always return the values in a deterministic order;
  // (from left to right) in the abi object

  let values: string[] = [];
  for (const [_, v] of Object.entries(abi)) {
    let entry_values = AnyToHexStrs(v);
    values = values.concat(entry_values);
  }

  return compute_partial_witnesses_aztec(circuit, values);
}


function AnyToHexStrs(any_object: any) : string[]  {
  let values : string[] = [] 
    if (Array.isArray(any_object)) {
      for (let variable of any_object) {
        values  = values.concat(AnyToHexStrs(variable));
      }
    } else if (typeof any_object === 'string' || any_object instanceof String) {
      // If the type is a string, we expect it to be a hex string
      let string_object = any_object as string;
    
      if (isValidHex(string_object)) {
        values.push(string_object)
      } else {
        // TODO: throw should not be in a library, but currently we aren't doing 
        // TODO: much in terms of error handling
        throw new Error("strings can only be hexadecimal and must start with 0x");
      }
      
    } else if (Number.isInteger(any_object)) {
      let number_object = any_object as number;
      let number_hex = number_object.toString(16);
      // The rust code only accepts even hex digits
      let is_even_hex_length = number_hex.length %2 == 0;
      if (is_even_hex_length) {
        values.push("0x" + number_hex)
      } else {
        values.push("0x0" + number_hex)
      }
    } else {
      throw new Error("unknown object type in the abi");
    }
    return values
}

function isValidHex(hex_str : string) : boolean {
  return !isNaN(Number(hex_str))
}


function getNumCores() {
  // TODO: The below comment was when we had this in a separate package
  //
  // Barretenberg.js uses navigator.hardwareConcurrency which is
  // only available in the desktop environment, not in js
  //
  // No need to find a polyfill for it, as our circuit is so small
  return 4;
}
