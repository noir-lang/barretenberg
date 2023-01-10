"use strict";
var TxType;
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    TxType: ()=>TxType,
    numTxTypes: ()=>numTxTypes,
    isDefiDepositTx: ()=>isDefiDepositTx,
    isAccountTx: ()=>isAccountTx,
    blockchainAssetToJson: ()=>blockchainAssetToJson,
    blockchainAssetFromJson: ()=>blockchainAssetFromJson,
    blockchainBridgeToJson: ()=>blockchainBridgeToJson,
    blockchainBridgeFromJson: ()=>blockchainBridgeFromJson,
    blockchainStatusToJson: ()=>blockchainStatusToJson,
    blockchainStatusFromJson: ()=>blockchainStatusFromJson
});
const _address = require("../address");
!function(TxType) {
    TxType[TxType.DEPOSIT = 0] = "DEPOSIT", TxType[TxType.TRANSFER = 1] = "TRANSFER", TxType[TxType.WITHDRAW_TO_WALLET = 2] = "WITHDRAW_TO_WALLET", TxType[TxType.WITHDRAW_HIGH_GAS = 3] = "WITHDRAW_HIGH_GAS", TxType[TxType.ACCOUNT = 4] = "ACCOUNT", TxType[TxType.DEFI_DEPOSIT = 5] = "DEFI_DEPOSIT", TxType[TxType.DEFI_CLAIM = 6] = "DEFI_CLAIM";
}(TxType || (TxType = {}));
const numTxTypes = 7;
function isDefiDepositTx(txType) {
    return txType === TxType.DEFI_DEPOSIT;
}
function isAccountTx(txType) {
    return txType === TxType.ACCOUNT;
}
const blockchainAssetToJson = ({ address , ...asset })=>({
        ...asset,
        address: address.toString()
    }), blockchainAssetFromJson = ({ address , ...asset })=>({
        ...asset,
        address: _address.EthAddress.fromString(address)
    }), blockchainBridgeToJson = ({ address , ...bridge })=>({
        ...bridge,
        address: address.toString()
    }), blockchainBridgeFromJson = ({ address , ...bridge })=>({
        ...bridge,
        address: _address.EthAddress.fromString(address)
    });
function blockchainStatusToJson(status) {
    return {
        ...status,
        rollupContractAddress: status.rollupContractAddress.toString(),
        verifierContractAddress: status.verifierContractAddress.toString(),
        dataRoot: status.dataRoot.toString('hex'),
        nullRoot: status.nullRoot.toString('hex'),
        rootRoot: status.rootRoot.toString('hex'),
        defiRoot: status.defiRoot.toString('hex'),
        defiInteractionHashes: status.defiInteractionHashes.map((v)=>v.toString('hex')),
        assets: status.assets.map(blockchainAssetToJson),
        bridges: status.bridges.map(blockchainBridgeToJson)
    };
}
function blockchainStatusFromJson(json) {
    return {
        ...json,
        rollupContractAddress: _address.EthAddress.fromString(json.rollupContractAddress),
        verifierContractAddress: _address.EthAddress.fromString(json.verifierContractAddress),
        dataRoot: Buffer.from(json.dataRoot, 'hex'),
        nullRoot: Buffer.from(json.nullRoot, 'hex'),
        rootRoot: Buffer.from(json.rootRoot, 'hex'),
        defiRoot: Buffer.from(json.defiRoot, 'hex'),
        defiInteractionHashes: json.defiInteractionHashes.map((f)=>Buffer.from(f, 'hex')),
        assets: json.assets.map(blockchainAssetFromJson),
        bridges: json.bridges.map(blockchainBridgeFromJson)
    };
}
