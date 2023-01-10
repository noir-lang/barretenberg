import { toBigIntBE } from '../../bigint_buffer';
import { BridgeId } from '../../bridge_id';
import { ProofData } from './proof_data';
import { ProofId } from './proof_id';
export class DefiClaimProofData {
    static fromBuffer(rawProofData) {
        return new DefiClaimProofData(new ProofData(rawProofData));
    }
    get txFee() {
        return toBigIntBE(this.proofData.txFee);
    }
    get txFeeAssetId() {
        return this.proofData.feeAssetId;
    }
    get bridgeId() {
        return BridgeId.fromBuffer(this.proofData.bridgeId);
    }
    constructor(proofData){
        if (this.proofData = proofData, proofData.proofId !== ProofId.DEFI_CLAIM) throw Error('Not a defi claim proof.');
    }
}
