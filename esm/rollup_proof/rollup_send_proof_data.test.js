import { ProofId } from '../client_proofs/proof_data';
import { randomInnerProofData, randomSendProofData } from './fixtures';
import { RollupSendProofData } from './rollup_send_proof_data';
import { RollupWithdrawProofData } from './rollup_withdraw_proof_data';
describe('RollupSendProofData', ()=>{
    it('throw if inner proof is not a send proof', ()=>{
        let innerProofData = randomInnerProofData(ProofId.DEPOSIT);
        expect(()=>new RollupSendProofData(innerProofData)).toThrow();
    }), it('encode and decode a proof', ()=>{
        let proof = new RollupSendProofData(randomSendProofData()), encoded = proof.encode();
        expect(encoded.length).toBe(RollupSendProofData.ENCODED_LENGTH), expect(RollupSendProofData.decode(encoded)).toEqual(proof);
    }), it('throw if try to decode the wrong type of proof', ()=>{
        let proof = new RollupWithdrawProofData(randomInnerProofData(ProofId.WITHDRAW)), encoded = proof.encode();
        expect(()=>RollupSendProofData.decode(encoded)).toThrow();
    });
});
