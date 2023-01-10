"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "encodeInnerProof", {
    enumerable: !0,
    get: ()=>encodeInnerProof
});
const _clientProofs = require("../client_proofs"), _rollupAccountProofData = require("./rollup_account_proof_data"), _rollupDefiClaimProofData = require("./rollup_defi_claim_proof_data"), _rollupDefiDepositProofData = require("./rollup_defi_deposit_proof_data"), _rollupDepositProofData = require("./rollup_deposit_proof_data"), _rollupSendProofData = require("./rollup_send_proof_data"), _rollupWithdrawProofData = require("./rollup_withdraw_proof_data"), _rollupPaddingProofData = require("./rollup_padding_proof_data"), recoverInnerProof = (proof)=>{
    switch(proof.proofId){
        case _clientProofs.ProofId.DEPOSIT:
            return new _rollupDepositProofData.RollupDepositProofData(proof);
        case _clientProofs.ProofId.WITHDRAW:
            return new _rollupWithdrawProofData.RollupWithdrawProofData(proof);
        case _clientProofs.ProofId.SEND:
            return new _rollupSendProofData.RollupSendProofData(proof);
        case _clientProofs.ProofId.ACCOUNT:
            return new _rollupAccountProofData.RollupAccountProofData(proof);
        case _clientProofs.ProofId.DEFI_DEPOSIT:
            return new _rollupDefiDepositProofData.RollupDefiDepositProofData(proof);
        case _clientProofs.ProofId.DEFI_CLAIM:
            return new _rollupDefiClaimProofData.RollupDefiClaimProofData(proof);
        case _clientProofs.ProofId.PADDING:
            return new _rollupPaddingProofData.RollupPaddingProofData(proof);
    }
}, encodeInnerProof = (proof)=>recoverInnerProof(proof).encode();
