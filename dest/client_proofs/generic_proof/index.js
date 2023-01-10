"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    setup_generic_prover_and_verifier: ()=>setup_generic_prover_and_verifier,
    create_proof: ()=>create_proof,
    create_proof_with_witness: ()=>create_proof_with_witness,
    verify_proof: ()=>verify_proof
});
const _aztecBackend = require("@noir-lang/aztec_backend"), _crs = require("../../crs"), _fft = require("../../fft"), _pippenger = require("../../pippenger"), _wasm = require("../../wasm"), _prover = require("../prover"), _standardExampleProver = _exportStar(require("./standard_example_prover"), exports), _standardExampleVerifier = _exportStar(require("./standard_example_verifier"), exports);
function _exportStar(from, to) {
    return Object.keys(from).forEach(function(k) {
        "default" === k || Object.prototype.hasOwnProperty.call(to, k) || Object.defineProperty(to, k, {
            enumerable: !0,
            get: function() {
                return from[k];
            }
        });
    }), from;
}
async function setup_generic_prover_and_verifier(acir) {
    let serialised_circuit = (0, _aztecBackend.serialise_acir_to_barrtenberg_circuit)(acir), barretenberg = await _wasm.BarretenbergWasm.new(), circSize = await (0, _standardExampleProver.getCircuitSize)(barretenberg, serialised_circuit), crs = await load_crs(circSize), wasm = await _wasm.BarretenbergWasm.new(), workerPool = await _wasm.WorkerPool.new(wasm, 4), pippenger = new _pippenger.PooledPippenger(workerPool), fft = new _fft.PooledFft(workerPool);
    await fft.init(circSize), await pippenger.init(crs.getData());
    let prover = new _prover.Prover(workerPool.workers[0], pippenger, fft), standardExampleProver = new _standardExampleProver.StandardExampleProver(prover);
    await standardExampleProver.initCircuitDefinition(serialised_circuit);
    let standardExampleVerifier = new _standardExampleVerifier.StandardExampleVerifier();
    return await standardExampleProver.computeKey(), await standardExampleVerifier.computeKey(pippenger.pool[0], crs.getG2Data()), await standardExampleVerifier.computeSmartContract(pippenger.pool[0], crs.getG2Data(), serialised_circuit), Promise.all([
        standardExampleProver,
        standardExampleVerifier
    ]);
}
async function load_crs(circSize) {
    let crs = new _crs.Crs(circSize + 1);
    return await crs.download(), crs;
}
async function create_proof(prover, acir, abi) {
    let witness_arr = await compute_partial_witnesses(acir, abi), proof = await prover.createProof(witness_arr);
    return proof;
}
async function create_proof_with_witness(prover, witness_arr) {
    let proof = await prover.createProof(witness_arr);
    return proof;
}
async function verify_proof(verifier, proof) {
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
    return (0, _aztecBackend.compute_witnesses)(circuit, values);
}
