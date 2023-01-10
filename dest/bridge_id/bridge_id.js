"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "BridgeId", {
    enumerable: !0,
    get: ()=>BridgeId
});
const _asset = require("../asset"), _bigintBuffer = require("../bigint_buffer"), _bitConfig = require("./bit_config"), _bridgeIdConfig = require("./bridge_id_config"), randomInt = (to = 1073741824 - 1)=>Math.floor(Math.random() * (to + 1)), getNumber = (val, offset, size)=>Number(val >> BigInt(offset) & (BigInt(1) << BigInt(size)) - BigInt(1));
class BridgeId {
    static random() {
        return new BridgeId(randomInt(), randomInt(), randomInt(), randomInt(), randomInt(), randomInt());
    }
    static fromBigInt(val) {
        let addressId = getNumber(val, _bridgeIdConfig.ADDRESS_OFFSET, _bridgeIdConfig.ADDRESS_BIT_LEN), inputAssetIdA = getNumber(val, _bridgeIdConfig.INPUT_ASSET_ID_A_OFFSET, _bridgeIdConfig.INPUT_ASSET_ID_A_LEN), outputAssetIdA = getNumber(val, _bridgeIdConfig.OUTPUT_ASSET_ID_A_OFFSET, _bridgeIdConfig.OUTPUT_ASSET_ID_A_LEN), inputAssetIdB = getNumber(val, _bridgeIdConfig.INPUT_ASSET_ID_B_OFFSET, _bridgeIdConfig.INPUT_ASSET_ID_B_LEN), outputAssetIdB = getNumber(val, _bridgeIdConfig.OUTPUT_ASSET_ID_B_OFFSET, _bridgeIdConfig.OUTPUT_ASSET_ID_B_LEN), auxData = getNumber(val, _bridgeIdConfig.AUX_DATA_OFFSET, _bridgeIdConfig.AUX_DATA_LEN), bitConfig = _bitConfig.BitConfig.fromBigInt(BigInt(getNumber(val, _bridgeIdConfig.BITCONFIG_OFFSET, _bridgeIdConfig.BITCONFIG_LEN)));
        if (!bitConfig.secondInputInUse && inputAssetIdB) throw Error('Inconsistent second input.');
        if (!bitConfig.secondOutputInUse && outputAssetIdB) throw Error('Inconsistent second output.');
        return new BridgeId(addressId, inputAssetIdA, outputAssetIdA, bitConfig.secondInputInUse ? inputAssetIdB : void 0, bitConfig.secondOutputInUse ? outputAssetIdB : void 0, auxData);
    }
    static fromBuffer(buf) {
        if (32 !== buf.length) throw Error('Invalid buffer.');
        return BridgeId.fromBigInt((0, _bigintBuffer.toBigIntBE)(buf));
    }
    static fromString(str) {
        return BridgeId.fromBuffer(Buffer.from(str.replace(/^0x/i, ''), 'hex'));
    }
    get firstInputVirtual() {
        return (0, _asset.isVirtualAsset)(this.inputAssetIdA);
    }
    get secondInputVirtual() {
        return !!this.inputAssetIdB && (0, _asset.isVirtualAsset)(this.inputAssetIdB);
    }
    get firstOutputVirtual() {
        return (0, _asset.isVirtualAsset)(this.outputAssetIdA);
    }
    get secondOutputVirtual() {
        return !!this.outputAssetIdB && (0, _asset.isVirtualAsset)(this.outputAssetIdB);
    }
    get secondInputInUse() {
        return this.bitConfig.secondInputInUse;
    }
    get secondOutputInUse() {
        return this.bitConfig.secondOutputInUse;
    }
    get numInputAssets() {
        return this.bitConfig.secondInputInUse ? 2 : 1;
    }
    get numOutputAssets() {
        return this.bitConfig.secondOutputInUse ? 2 : 1;
    }
    toBigInt() {
        return BigInt(this.addressId) + (BigInt(this.inputAssetIdA) << BigInt(_bridgeIdConfig.INPUT_ASSET_ID_A_OFFSET)) + (BigInt(this.inputAssetIdB || 0) << BigInt(_bridgeIdConfig.INPUT_ASSET_ID_B_OFFSET)) + (BigInt(this.outputAssetIdA) << BigInt(_bridgeIdConfig.OUTPUT_ASSET_ID_A_OFFSET)) + (BigInt(this.outputAssetIdB || 0) << BigInt(_bridgeIdConfig.OUTPUT_ASSET_ID_B_OFFSET)) + (this.bitConfig.toBigInt() << BigInt(_bridgeIdConfig.BITCONFIG_OFFSET)) + (BigInt(this.auxData) << BigInt(_bridgeIdConfig.AUX_DATA_OFFSET));
    }
    toBuffer() {
        return (0, _bigintBuffer.toBufferBE)(this.toBigInt(), 32);
    }
    toString() {
        return `0x${this.toBuffer().toString('hex')}`;
    }
    equals(id) {
        return id.toBuffer().equals(this.toBuffer());
    }
    constructor(addressId, inputAssetIdA, outputAssetIdA, inputAssetIdB, outputAssetIdB, auxData = 0){
        this.addressId = addressId, this.inputAssetIdA = inputAssetIdA, this.outputAssetIdA = outputAssetIdA, this.inputAssetIdB = inputAssetIdB, this.outputAssetIdB = outputAssetIdB, this.auxData = auxData, this.bitConfig = new _bitConfig.BitConfig(void 0 !== inputAssetIdB, void 0 !== outputAssetIdB);
    }
}
BridgeId.ZERO = new BridgeId(0, 0, 0), BridgeId.ENCODED_LENGTH_IN_BYTES = 32;
