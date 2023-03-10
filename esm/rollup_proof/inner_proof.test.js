import { randomBytes } from 'crypto';
import { ProofData, ProofId } from '../client_proofs';
import { randomInnerProofData } from './fixtures';
import { InnerProofData } from './inner_proof';
describe('InnerProofData', ()=>{
    it('can convert an inner proof object to buffer and back', ()=>{
        let innerProofData = randomInnerProofData(), buffer = innerProofData.toBuffer();
        expect(buffer.length).toBe(InnerProofData.LENGTH);
        let recovered = InnerProofData.fromBuffer(buffer);
        expect(recovered).toEqual(innerProofData);
    }), it('should generate the same txId for all proof types', ()=>{
        [
            ProofId.DEPOSIT,
            ProofId.WITHDRAW,
            ProofId.SEND,
            ProofId.ACCOUNT,
            ProofId.DEFI_CLAIM,
            ProofId.DEFI_CLAIM
        ].forEach((proofId)=>{
            let innerProofData = randomInnerProofData(proofId), rawClientProof = Buffer.concat([
                innerProofData.toBuffer(),
                randomBytes(32 * (ProofData.NUM_PUBLIC_INPUTS - InnerProofData.NUM_PUBLIC_INPUTS))
            ]), clientProofData = new ProofData(rawClientProof);
            expect(innerProofData.txId).toEqual(clientProofData.txId);
        });
    });
});
