"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _index = require("./index"), _util = require("util"), _wasm = require("../../wasm"), _grumpkin = require("../../ecc/grumpkin");
describe('schnorr', ()=>{
    let barretenberg, schnorr, grumpkin;
    beforeAll(async ()=>{
        await (barretenberg = new _wasm.BarretenbergWasm()).init(), schnorr = new _index.Schnorr(barretenberg), grumpkin = new _grumpkin.Grumpkin(barretenberg);
    }), it('should verify signature', ()=>{
        let pk = Buffer.from([
            0x0b,
            0x9b,
            0x3a,
            0xde,
            0xe6,
            0xb3,
            0xd8,
            0x1b,
            0x28,
            0xa0,
            0x88,
            0x6b,
            0x2a,
            0x84,
            0x15,
            0xc7,
            0xda,
            0x31,
            0x29,
            0x1a,
            0x5e,
            0x96,
            0xbb,
            0x7a,
            0x56,
            0x63,
            0x9e,
            0x17,
            0x7d,
            0x30,
            0x1b,
            0xeb
        ]), pubKey = schnorr.computePublicKey(pk), msg = new _util.TextEncoder().encode('The quick brown dog jumped over the lazy fox.'), signature = schnorr.constructSignature(msg, pk), verified = schnorr.verifySignature(msg, pubKey, signature);
        expect(verified).toBe(!0);
    }), it('should create + verify multi signature', ()=>{
        let pks = [], pubKeys = [], roundOnePublicOutputs = [], roundOnePrivateOutputs = [], roundTwoOutputs = [], msg = new _util.TextEncoder().encode('The quick brown dog jumped over the lazy fox.');
        for(let i = 0; i < 7; ++i){
            let pk = grumpkin.getRandomFr();
            pks.push(pk), pubKeys.push(schnorr.multiSigComputePublicKey(pk));
        }
        for(let i1 = 0; i1 < 7; ++i1){
            let { publicOutput , privateOutput  } = schnorr.multiSigRoundOne();
            roundOnePublicOutputs.push(publicOutput), roundOnePrivateOutputs.push(privateOutput);
        }
        for(let i2 = 0; i2 < 7; ++i2)roundTwoOutputs.push(schnorr.multiSigRoundTwo(msg, pks[i2], roundOnePrivateOutputs[i2], pubKeys, roundOnePublicOutputs));
        let signature = schnorr.multiSigCombineSignatures(msg, pubKeys, roundOnePublicOutputs, roundTwoOutputs), verified = schnorr.verifySignature(msg, schnorr.multiSigValidateAndCombinePublicKeys(pubKeys), signature);
        expect(verified).toBe(!0);
    });
});
