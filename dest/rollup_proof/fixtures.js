"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    randomDepositProofData: ()=>randomDepositProofData,
    randomSendProofData: ()=>randomSendProofData,
    randomWithdrawProofData: ()=>randomWithdrawProofData,
    randomInnerProofData: ()=>randomInnerProofData,
    createRollupProofData: ()=>createRollupProofData
});
const _crypto = require("crypto"), _address = require("../address"), _proofData = require("../client_proofs/proof_data"), _ = require("./"), randomCommitment = ()=>(0, _crypto.randomBytes)(32), randomNullifier = ()=>(0, _crypto.randomBytes)(32), randomInt = ()=>Buffer.concat([
        Buffer.alloc(28),
        (0, _crypto.randomBytes)(4)
    ]), randomDepositProofData = ()=>new _.InnerProofData(_proofData.ProofId.DEPOSIT, randomCommitment(), randomCommitment(), randomNullifier(), randomNullifier(), randomInt(), _address.EthAddress.random().toBuffer32(), Buffer.alloc(32)), randomSendProofData = ()=>new _.InnerProofData(_proofData.ProofId.SEND, randomCommitment(), randomCommitment(), randomNullifier(), randomNullifier(), Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32)), randomWithdrawProofData = ()=>new _.InnerProofData(_proofData.ProofId.WITHDRAW, randomCommitment(), randomCommitment(), randomNullifier(), randomNullifier(), randomInt(), _address.EthAddress.random().toBuffer32(), randomInt()), randomInnerProofData = (proofId = _proofData.ProofId.SEND)=>{
    switch(proofId){
        case _proofData.ProofId.DEPOSIT:
            return randomDepositProofData();
        case _proofData.ProofId.WITHDRAW:
            return randomWithdrawProofData();
        case _proofData.ProofId.SEND:
            return randomSendProofData();
        default:
            return new _.InnerProofData(proofId, randomCommitment(), randomCommitment(), randomNullifier(), [
                _proofData.ProofId.ACCOUNT,
                _proofData.ProofId.DEFI_DEPOSIT
            ].includes(proofId) ? randomNullifier() : Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32));
    }
}, createRollupProofData = (innerProofs)=>{
    let bridgeIds = [
        ...Array(_.RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK)
    ].map(()=>(0, _crypto.randomBytes)(32)), defiDepositSums = [
        ...Array(_.RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK)
    ].map(()=>BigInt(0)), defiInteractionNotes = [
        ...Array(_.RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK)
    ].map(()=>(0, _crypto.randomBytes)(32)), assetIds = [
        ...Array(_.RollupProofData.NUMBER_OF_ASSETS)
    ].map(()=>0), totalTxFees = [
        ...Array(_.RollupProofData.NUMBER_OF_ASSETS)
    ].map(()=>BigInt(0));
    return new _.RollupProofData((0, _crypto.randomBytes)(4).readUInt32BE(0), innerProofs.length, (0, _crypto.randomBytes)(4).readUInt32BE(0), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), bridgeIds, defiDepositSums, assetIds, totalTxFees, defiInteractionNotes, (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), innerProofs.length, innerProofs);
};
