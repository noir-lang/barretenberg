"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _crypto = require("crypto"), _clientProofs = require("../client_proofs"), _fixtures = require("./fixtures"), _innerProof = require("./inner_proof");
describe('InnerProofData', ()=>{
    it('can convert an inner proof object to buffer and back', ()=>{
        let innerProofData = (0, _fixtures.randomInnerProofData)(), buffer = innerProofData.toBuffer();
        expect(buffer.length).toBe(_innerProof.InnerProofData.LENGTH);
        let recovered = _innerProof.InnerProofData.fromBuffer(buffer);
        expect(recovered).toEqual(innerProofData);
    }), it('should generate the same txId for all proof types', ()=>{
        [
            _clientProofs.ProofId.DEPOSIT,
            _clientProofs.ProofId.WITHDRAW,
            _clientProofs.ProofId.SEND,
            _clientProofs.ProofId.ACCOUNT,
            _clientProofs.ProofId.DEFI_CLAIM,
            _clientProofs.ProofId.DEFI_CLAIM
        ].forEach((proofId)=>{
            let innerProofData = (0, _fixtures.randomInnerProofData)(proofId), rawClientProof = Buffer.concat([
                innerProofData.toBuffer(),
                (0, _crypto.randomBytes)(32 * (_clientProofs.ProofData.NUM_PUBLIC_INPUTS - _innerProof.InnerProofData.NUM_PUBLIC_INPUTS))
            ]), clientProofData = new _clientProofs.ProofData(rawClientProof);
            expect(innerProofData.txId).toEqual(clientProofData.txId);
        });
    });
});
