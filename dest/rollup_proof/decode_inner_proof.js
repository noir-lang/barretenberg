"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    decodeProofId: ()=>decodeProofId,
    getEncodedProofSizeForId: ()=>getEncodedProofSizeForId,
    decodeInnerProof: ()=>decodeInnerProof
});
const _clientProofs = require("../client_proofs"), _rollupAccountProofData = require("./rollup_account_proof_data"), _rollupDefiClaimProofData = require("./rollup_defi_claim_proof_data"), _rollupDefiDepositProofData = require("./rollup_defi_deposit_proof_data"), _rollupDepositProofData = require("./rollup_deposit_proof_data"), _rollupPaddingProofData = require("./rollup_padding_proof_data"), _rollupSendProofData = require("./rollup_send_proof_data"), _rollupWithdrawProofData = require("./rollup_withdraw_proof_data"), decodeProofId = (encoded)=>encoded.readUInt8(0), recoverProof = (encoded)=>{
    let proofId = decodeProofId(encoded);
    switch(proofId){
        case _clientProofs.ProofId.DEPOSIT:
            return _rollupDepositProofData.RollupDepositProofData.decode(encoded);
        case _clientProofs.ProofId.WITHDRAW:
            return _rollupWithdrawProofData.RollupWithdrawProofData.decode(encoded);
        case _clientProofs.ProofId.SEND:
            return _rollupSendProofData.RollupSendProofData.decode(encoded);
        case _clientProofs.ProofId.ACCOUNT:
            return _rollupAccountProofData.RollupAccountProofData.decode(encoded);
        case _clientProofs.ProofId.DEFI_DEPOSIT:
            return _rollupDefiDepositProofData.RollupDefiDepositProofData.decode(encoded);
        case _clientProofs.ProofId.DEFI_CLAIM:
            return _rollupDefiClaimProofData.RollupDefiClaimProofData.decode(encoded);
        case _clientProofs.ProofId.PADDING:
            return _rollupPaddingProofData.RollupPaddingProofData.decode(encoded);
    }
}, getEncodedProofSizeForId = (proofId)=>{
    switch(proofId){
        case _clientProofs.ProofId.DEPOSIT:
            return _rollupDepositProofData.RollupDepositProofData.ENCODED_LENGTH;
        case _clientProofs.ProofId.WITHDRAW:
            return _rollupWithdrawProofData.RollupWithdrawProofData.ENCODED_LENGTH;
        case _clientProofs.ProofId.SEND:
            return _rollupSendProofData.RollupSendProofData.ENCODED_LENGTH;
        case _clientProofs.ProofId.ACCOUNT:
            return _rollupAccountProofData.RollupAccountProofData.ENCODED_LENGTH;
        case _clientProofs.ProofId.DEFI_DEPOSIT:
            return _rollupDefiDepositProofData.RollupDefiDepositProofData.ENCODED_LENGTH;
        case _clientProofs.ProofId.DEFI_CLAIM:
            return _rollupDefiClaimProofData.RollupDefiClaimProofData.ENCODED_LENGTH;
        case _clientProofs.ProofId.PADDING:
            return _rollupPaddingProofData.RollupPaddingProofData.ENCODED_LENGTH;
    }
}, decodeInnerProof = (encoded)=>recoverProof(encoded);
