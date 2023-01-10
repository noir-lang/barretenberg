"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    getOffchainDataLength: ()=>getOffchainDataLength,
    sliceOffchainTxData: ()=>sliceOffchainTxData
});
const _clientProofs = require("../client_proofs"), _offchainAccountData = require("./offchain_account_data"), _offchainDefiDepositData = require("./offchain_defi_deposit_data"), _offchainJoinSplitData = require("./offchain_join_split_data");
function getOffchainDataLength(proofId) {
    switch(proofId){
        case _clientProofs.ProofId.DEPOSIT:
        case _clientProofs.ProofId.WITHDRAW:
        case _clientProofs.ProofId.SEND:
            return _offchainJoinSplitData.OffchainJoinSplitData.SIZE;
        case _clientProofs.ProofId.ACCOUNT:
            return _offchainAccountData.OffchainAccountData.SIZE;
        case _clientProofs.ProofId.DEFI_DEPOSIT:
            return _offchainDefiDepositData.OffchainDefiDepositData.SIZE;
        default:
            return 0;
    }
}
const sliceOffchainTxData = (proofIds, offchainTxData)=>{
    let dataStart = 0, dataEnd = 0, result = proofIds.map((proofId)=>(dataStart = dataEnd, dataEnd += getOffchainDataLength(proofId), offchainTxData.slice(dataStart, dataEnd)));
    if (dataEnd != offchainTxData.length) throw Error('Offchain data has unexpected length for given proof ids.');
    return result;
};
