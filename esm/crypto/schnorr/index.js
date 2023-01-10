import { SchnorrSignature } from './signature';
import { serializeBufferArrayToVector } from '../../serialize';
export * from './signature';
export class Schnorr {
    constructSignature(msg, pk) {
        return this.wasm.transferToHeap(pk, 64), this.wasm.transferToHeap(msg, 96), this.wasm.call('construct_signature', 96, msg.length, 64, 0, 32), new SchnorrSignature(Buffer.from(this.wasm.sliceMemory(0, 64)));
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
        let buffer = serializeBufferArrayToVector(pubKeys);
        return this.wasm.transferToHeap(buffer, 64), this.wasm.call('multisig_validate_and_combine_signer_pubkeys', 64, 0), Buffer.from(this.wasm.sliceMemory(0, 64));
    }
    multiSigRoundOne() {
        return this.wasm.call('multisig_construct_signature_round_1', 0, 128), {
            publicOutput: Buffer.from(this.wasm.sliceMemory(0, 128)),
            privateOutput: Buffer.from(this.wasm.sliceMemory(128, 192))
        };
    }
    multiSigRoundTwo(msg, pk, signerrRoundOnePrivateOutput, pubKeys, roundOnePublicOutputs) {
        let pubKeysBuffer = serializeBufferArrayToVector(pubKeys), roundOneOutputsBuffer = serializeBufferArrayToVector(roundOnePublicOutputs);
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
        let pubKeysBuffer = serializeBufferArrayToVector(pubKeys), roundOneOutputsBuffer = serializeBufferArrayToVector(roundOneOutputs), roundTwoOutputsBuffer = serializeBufferArrayToVector(roundTwoOutputs);
        this.wasm.transferToHeap(msg, 64);
        let pubKeysPtr = 64 + msg.length;
        this.wasm.transferToHeap(pubKeysBuffer, pubKeysPtr);
        let roundOnePtr = pubKeysPtr + pubKeysBuffer.length;
        this.wasm.transferToHeap(roundOneOutputsBuffer, roundOnePtr);
        let roundTwoPtr = roundOnePtr + roundOneOutputsBuffer.length;
        return this.wasm.transferToHeap(roundTwoOutputsBuffer, roundTwoPtr), this.wasm.call('multisig_combine_signatures', 64, msg.length, pubKeysPtr, roundOnePtr, roundTwoPtr, 0, 32), new SchnorrSignature(Buffer.from(this.wasm.sliceMemory(0, 64)));
    }
    constructor(wasm){
        this.wasm = wasm;
    }
}
