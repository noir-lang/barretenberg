"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "Schnorr", {
    enumerable: !0,
    get: ()=>Schnorr
});
const _signature = function(from, to) {
    return Object.keys(from).forEach(function(k) {
        "default" === k || Object.prototype.hasOwnProperty.call(to, k) || Object.defineProperty(to, k, {
            enumerable: !0,
            get: function() {
                return from[k];
            }
        });
    }), from;
}(require("./signature"), exports), _serialize = require("../../serialize");
class Schnorr {
    constructSignature(msg, pk) {
        return this.wasm.transferToHeap(pk, 64), this.wasm.transferToHeap(msg, 96), this.wasm.call('construct_signature', 96, msg.length, 64, 0, 32), new _signature.SchnorrSignature(Buffer.from(this.wasm.sliceMemory(0, 64)));
    }
    computePublicKey(pk) {
        return this.wasm.transferToHeap(pk, 0), this.wasm.call('compute_public_key', 0, 32), Buffer.from(this.wasm.sliceMemory(32, 96));
    }
    verifySignature(msg, pubKey, sig) {
        return this.wasm.transferToHeap(pubKey, 0), this.wasm.transferToHeap(sig.s(), 64), this.wasm.transferToHeap(sig.e(), 96), this.wasm.transferToHeap(msg, 128), !!this.wasm.call('verify_signature', 128, msg.length, 0, 64, 96);
    }
    multiSigComputePublicKey(pk) {
        return this.wasm.transferToHeap(pk, 128), this.wasm.call('multisig_create_multisig_public_key', 128, 0), Buffer.from(this.wasm.sliceMemory(0, 128));
    }
    multiSigValidateAndCombinePublicKeys(pubKeys) {
        let buffer = (0, _serialize.serializeBufferArrayToVector)(pubKeys);
        return this.wasm.transferToHeap(buffer, 64), this.wasm.call('multisig_validate_and_combine_signer_pubkeys', 64, 0), Buffer.from(this.wasm.sliceMemory(0, 64));
    }
    multiSigRoundOne() {
        return this.wasm.call('multisig_construct_signature_round_1', 0, 128), {
            publicOutput: Buffer.from(this.wasm.sliceMemory(0, 128)),
            privateOutput: Buffer.from(this.wasm.sliceMemory(128, 192))
        };
    }
    multiSigRoundTwo(msg, pk, signerrRoundOnePrivateOutput, pubKeys, roundOnePublicOutputs) {
        let pubKeysBuffer = (0, _serialize.serializeBufferArrayToVector)(pubKeys), roundOneOutputsBuffer = (0, _serialize.serializeBufferArrayToVector)(roundOnePublicOutputs);
        this.wasm.transferToHeap(msg, 32);
        let pkPtr = 32 + msg.length;
        this.wasm.transferToHeap(pk, pkPtr);
        let roundOnePrivatePtr = pkPtr + 32;
        this.wasm.transferToHeap(signerrRoundOnePrivateOutput, roundOnePrivatePtr);
        let pubKeysPtr = roundOnePrivatePtr + 64;
        this.wasm.transferToHeap(pubKeysBuffer, pubKeysPtr);
        let roundOnePtr = pubKeysPtr + pubKeysBuffer.length;
        return this.wasm.transferToHeap(roundOneOutputsBuffer, roundOnePtr), this.wasm.call('multisig_construct_signature_round_2', 32, msg.length, pkPtr, roundOnePrivatePtr, pubKeysPtr, roundOnePtr, 0), Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    multiSigCombineSignatures(msg, pubKeys, roundOneOutputs, roundTwoOutputs) {
        let pubKeysBuffer = (0, _serialize.serializeBufferArrayToVector)(pubKeys), roundOneOutputsBuffer = (0, _serialize.serializeBufferArrayToVector)(roundOneOutputs), roundTwoOutputsBuffer = (0, _serialize.serializeBufferArrayToVector)(roundTwoOutputs);
        this.wasm.transferToHeap(msg, 64);
        let pubKeysPtr = 64 + msg.length;
        this.wasm.transferToHeap(pubKeysBuffer, pubKeysPtr);
        let roundOnePtr = pubKeysPtr + pubKeysBuffer.length;
        this.wasm.transferToHeap(roundOneOutputsBuffer, roundOnePtr);
        let roundTwoPtr = roundOnePtr + roundOneOutputsBuffer.length;
        return this.wasm.transferToHeap(roundTwoOutputsBuffer, roundTwoPtr), this.wasm.call('multisig_combine_signatures', 64, msg.length, pubKeysPtr, roundOnePtr, roundTwoPtr, 0, 32), new _signature.SchnorrSignature(Buffer.from(this.wasm.sliceMemory(0, 64)));
    }
    constructor(wasm){
        this.wasm = wasm;
    }
}
