import { EthAddress } from '../address';
import { TxId } from '../tx_id';
export var TxSettlementTime;
!function(TxSettlementTime) {
    TxSettlementTime[TxSettlementTime.NEXT_ROLLUP = 0] = "NEXT_ROLLUP", TxSettlementTime[TxSettlementTime.INSTANT = 1] = "INSTANT";
}(TxSettlementTime || (TxSettlementTime = {}));
export var DefiSettlementTime;
!function(DefiSettlementTime) {
    DefiSettlementTime[DefiSettlementTime.DEADLINE = 0] = "DEADLINE", DefiSettlementTime[DefiSettlementTime.NEXT_ROLLUP = 1] = "NEXT_ROLLUP", DefiSettlementTime[DefiSettlementTime.INSTANT = 2] = "INSTANT";
}(DefiSettlementTime || (DefiSettlementTime = {}));
export const txToJson = ({ proofData , offchainTxData , depositSignature  })=>({
        proofData: proofData.toString('hex'),
        offchainTxData: offchainTxData.toString('hex'),
        depositSignature: depositSignature ? depositSignature.toString('hex') : void 0
    });
export const txFromJson = ({ proofData , offchainTxData , depositSignature  })=>({
        proofData: Buffer.from(proofData, 'hex'),
        offchainTxData: Buffer.from(offchainTxData, 'hex'),
        depositSignature: depositSignature ? Buffer.from(depositSignature, 'hex') : void 0
    });
export const pendingTxToJson = ({ txId , noteCommitment1 , noteCommitment2  })=>({
        txId: txId.toString(),
        noteCommitment1: noteCommitment1.toString('hex'),
        noteCommitment2: noteCommitment2.toString('hex')
    });
export const pendingTxFromJson = ({ txId , noteCommitment1 , noteCommitment2  })=>({
        txId: TxId.fromString(txId),
        noteCommitment1: Buffer.from(noteCommitment1, 'hex'),
        noteCommitment2: Buffer.from(noteCommitment2, 'hex')
    });
export const initialWorldStateToBuffer = (initialWorldState)=>{
    let accountsSizeBuf = Buffer.alloc(4);
    return accountsSizeBuf.writeUInt32BE(initialWorldState.initialAccounts.length), Buffer.concat([
        accountsSizeBuf,
        initialWorldState.initialAccounts,
        ...initialWorldState.initialSubtreeRoots
    ]);
};
export const initialWorldStateFromBuffer = (data)=>{
    let accountsSize = data.readUInt32BE(0), subTreeStart = 4 + accountsSize, initialWorldState = {
        initialAccounts: data.slice(4, subTreeStart),
        initialSubtreeRoots: []
    };
    for(let i = subTreeStart; i < data.length; i += 32)initialWorldState.initialSubtreeRoots.push(data.slice(i, i + 32));
    return initialWorldState;
};
export const depositTxToJson = ({ assetId , value , publicOwner  })=>({
        assetId,
        value: value.toString(),
        publicOwner: publicOwner.toString()
    });
export const depositTxFromJson = ({ assetId , value , publicOwner  })=>({
        assetId,
        value: BigInt(value),
        publicOwner: EthAddress.fromString(publicOwner)
    });
