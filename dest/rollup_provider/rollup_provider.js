"use strict";
var TxSettlementTime, DefiSettlementTime;
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    TxSettlementTime: ()=>TxSettlementTime,
    DefiSettlementTime: ()=>DefiSettlementTime,
    txToJson: ()=>txToJson,
    txFromJson: ()=>txFromJson,
    pendingTxToJson: ()=>pendingTxToJson,
    pendingTxFromJson: ()=>pendingTxFromJson,
    initialWorldStateToBuffer: ()=>initialWorldStateToBuffer,
    initialWorldStateFromBuffer: ()=>initialWorldStateFromBuffer,
    depositTxToJson: ()=>depositTxToJson,
    depositTxFromJson: ()=>depositTxFromJson
});
const _address = require("../address"), _txId = require("../tx_id");
!function(TxSettlementTime) {
    TxSettlementTime[TxSettlementTime.NEXT_ROLLUP = 0] = "NEXT_ROLLUP", TxSettlementTime[TxSettlementTime.INSTANT = 1] = "INSTANT";
}(TxSettlementTime || (TxSettlementTime = {})), function(DefiSettlementTime) {
    DefiSettlementTime[DefiSettlementTime.DEADLINE = 0] = "DEADLINE", DefiSettlementTime[DefiSettlementTime.NEXT_ROLLUP = 1] = "NEXT_ROLLUP", DefiSettlementTime[DefiSettlementTime.INSTANT = 2] = "INSTANT";
}(DefiSettlementTime || (DefiSettlementTime = {}));
const txToJson = ({ proofData , offchainTxData , depositSignature  })=>({
        proofData: proofData.toString('hex'),
        offchainTxData: offchainTxData.toString('hex'),
        depositSignature: depositSignature ? depositSignature.toString('hex') : void 0
    }), txFromJson = ({ proofData , offchainTxData , depositSignature  })=>({
        proofData: Buffer.from(proofData, 'hex'),
        offchainTxData: Buffer.from(offchainTxData, 'hex'),
        depositSignature: depositSignature ? Buffer.from(depositSignature, 'hex') : void 0
    }), pendingTxToJson = ({ txId , noteCommitment1 , noteCommitment2  })=>({
        txId: txId.toString(),
        noteCommitment1: noteCommitment1.toString('hex'),
        noteCommitment2: noteCommitment2.toString('hex')
    }), pendingTxFromJson = ({ txId , noteCommitment1 , noteCommitment2  })=>({
        txId: _txId.TxId.fromString(txId),
        noteCommitment1: Buffer.from(noteCommitment1, 'hex'),
        noteCommitment2: Buffer.from(noteCommitment2, 'hex')
    }), initialWorldStateToBuffer = (initialWorldState)=>{
    let accountsSizeBuf = Buffer.alloc(4);
    return accountsSizeBuf.writeUInt32BE(initialWorldState.initialAccounts.length), Buffer.concat([
        accountsSizeBuf,
        initialWorldState.initialAccounts,
        ...initialWorldState.initialSubtreeRoots
    ]);
}, initialWorldStateFromBuffer = (data)=>{
    let accountsSize = data.readUInt32BE(0), subTreeStart = 4 + accountsSize, initialWorldState = {
        initialAccounts: data.slice(4, subTreeStart),
        initialSubtreeRoots: []
    };
    for(let i = subTreeStart; i < data.length; i += 32)initialWorldState.initialSubtreeRoots.push(data.slice(i, i + 32));
    return initialWorldState;
}, depositTxToJson = ({ assetId , value , publicOwner  })=>({
        assetId,
        value: value.toString(),
        publicOwner: publicOwner.toString()
    }), depositTxFromJson = ({ assetId , value , publicOwner  })=>({
        assetId,
        value: BigInt(value),
        publicOwner: _address.EthAddress.fromString(publicOwner)
    });
