import { ProofData } from './proof_data';
import { ProofId } from './proof_id';
export class AccountProofData {
    static fromBuffer(rawProofData) {
        return new AccountProofData(new ProofData(rawProofData));
    }
    constructor(proofData){
        if (this.proofData = proofData, proofData.proofId !== ProofId.ACCOUNT) throw Error('Not an account proof.');
    }
}
