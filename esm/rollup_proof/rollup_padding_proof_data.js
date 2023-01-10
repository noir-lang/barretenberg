import { ProofId } from '../client_proofs';
import { InnerProofData } from './inner_proof';
export class RollupPaddingProofData {
    get ENCODED_LENGTH() {
        return RollupPaddingProofData.ENCODED_LENGTH;
    }
    static decode(encoded) {
        let proofId = encoded.readUInt8(0);
        if (proofId !== ProofId.PADDING) throw Error('Not a padding proof.');
        return new RollupPaddingProofData(new InnerProofData(ProofId.PADDING, Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32)));
    }
    encode() {
        return Buffer.from([
            ProofId.PADDING
        ]);
    }
    constructor(proofData){
        if (this.proofData = proofData, proofData.proofId !== ProofId.PADDING) throw Error('Not a padding proof.');
    }
}
RollupPaddingProofData.ENCODED_LENGTH = 1;
