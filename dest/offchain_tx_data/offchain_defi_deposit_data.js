"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "OffchainDefiDepositData", {
    enumerable: !0,
    get: ()=>OffchainDefiDepositData
});
const _address = require("../address"), _bigintBuffer = require("../bigint_buffer"), _bridgeId = require("../bridge_id"), _serialize = require("../serialize"), _viewingKey = require("../viewing_key");
class OffchainDefiDepositData {
    static fromBuffer(buf) {
        if (buf.length !== OffchainDefiDepositData.SIZE) throw Error('Invalid buffer size.');
        let dataStart = 0, bridgeId = _bridgeId.BridgeId.fromBuffer(buf.slice(dataStart, dataStart + 32));
        dataStart += 32;
        let partialState = buf.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let partialStateSecretEphPubKey = new _address.GrumpkinAddress(buf.slice(dataStart, dataStart + 64));
        dataStart += 64;
        let depositValue = (0, _bigintBuffer.toBigIntBE)(buf.slice(dataStart, dataStart + 32));
        dataStart += 32;
        let txFee = (0, _bigintBuffer.toBigIntBE)(buf.slice(dataStart, dataStart + 32));
        dataStart += 32;
        let viewingKey = new _viewingKey.ViewingKey(buf.slice(dataStart, dataStart + _viewingKey.ViewingKey.SIZE));
        dataStart += _viewingKey.ViewingKey.SIZE;
        let txRefNo = buf.readUInt32BE(dataStart);
        return new OffchainDefiDepositData(bridgeId, partialState, partialStateSecretEphPubKey, depositValue, txFee, viewingKey, txRefNo);
    }
    toBuffer() {
        return Buffer.concat([
            this.bridgeId.toBuffer(),
            this.partialState,
            this.partialStateSecretEphPubKey.toBuffer(),
            (0, _bigintBuffer.toBufferBE)(this.depositValue, 32),
            (0, _bigintBuffer.toBufferBE)(this.txFee, 32),
            this.viewingKey.toBuffer(),
            (0, _serialize.numToUInt32BE)(this.txRefNo)
        ]);
    }
    constructor(bridgeId, partialState, partialStateSecretEphPubKey, depositValue, txFee, viewingKey, txRefNo = 0){
        if (this.bridgeId = bridgeId, this.partialState = partialState, this.partialStateSecretEphPubKey = partialStateSecretEphPubKey, this.depositValue = depositValue, this.txFee = txFee, this.viewingKey = viewingKey, this.txRefNo = txRefNo, 32 !== partialState.length) throw Error('Expect partialState to be 32 bytes.');
        if (viewingKey.isEmpty()) throw Error('Viewing key cannot be empty.');
    }
}
OffchainDefiDepositData.EMPTY = new OffchainDefiDepositData(_bridgeId.BridgeId.ZERO, Buffer.alloc(32), _address.GrumpkinAddress.ZERO, BigInt(0), BigInt(0), new _viewingKey.ViewingKey(Buffer.alloc(_viewingKey.ViewingKey.SIZE))), OffchainDefiDepositData.SIZE = OffchainDefiDepositData.EMPTY.toBuffer().length;
