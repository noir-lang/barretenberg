import { toBigIntBE } from '../../bigint_buffer';
import { BridgeId } from '../../bridge_id';
import { ProofData } from './proof_data';
import { ProofId } from './proof_id';
export class DefiDepositProofData {
    static fromBuffer(rawProofData) {
        return new DefiDepositProofData(new ProofData(rawProofData));
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
    get defiDepositValue() {
        return toBigIntBE(this.proofData.defiDepositValue);
    }
    constructor(proofData){
        if (this.proofData = proofData, proofData.proofId !== ProofId.DEFI_DEPOSIT) throw Error('Not a defi deposit proof.');
    }
}
