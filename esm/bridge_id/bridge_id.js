import { isVirtualAsset } from '../asset';
import { toBigIntBE, toBufferBE } from '../bigint_buffer';
import { BitConfig } from './bit_config';
import { ADDRESS_BIT_LEN, ADDRESS_OFFSET, AUX_DATA_LEN, AUX_DATA_OFFSET, BITCONFIG_LEN, BITCONFIG_OFFSET, INPUT_ASSET_ID_A_LEN, INPUT_ASSET_ID_A_OFFSET, INPUT_ASSET_ID_B_LEN, INPUT_ASSET_ID_B_OFFSET, OUTPUT_ASSET_ID_A_LEN, OUTPUT_ASSET_ID_A_OFFSET, OUTPUT_ASSET_ID_B_LEN, OUTPUT_ASSET_ID_B_OFFSET } from './bridge_id_config';
let randomInt = (to = 1073741824 - 1)=>Math.floor(Math.random() * (to + 1)), getNumber = (val, offset, size)=>Number(val >> BigInt(offset) & (BigInt(1) << BigInt(size)) - BigInt(1));
export class BridgeId {
    static random() {
        return new BridgeId(randomInt(), randomInt(), randomInt(), randomInt(), randomInt(), randomInt());
    }
    static fromBigInt(val) {
        let addressId = getNumber(val, ADDRESS_OFFSET, ADDRESS_BIT_LEN), inputAssetIdA = getNumber(val, INPUT_ASSET_ID_A_OFFSET, INPUT_ASSET_ID_A_LEN), outputAssetIdA = getNumber(val, OUTPUT_ASSET_ID_A_OFFSET, OUTPUT_ASSET_ID_A_LEN), inputAssetIdB = getNumber(val, INPUT_ASSET_ID_B_OFFSET, INPUT_ASSET_ID_B_LEN), outputAssetIdB = getNumber(val, OUTPUT_ASSET_ID_B_OFFSET, OUTPUT_ASSET_ID_B_LEN), auxData = getNumber(val, AUX_DATA_OFFSET, AUX_DATA_LEN), bitConfig = BitConfig.fromBigInt(BigInt(getNumber(val, BITCONFIG_OFFSET, BITCONFIG_LEN)));
        if (!bitConfig.secondInputInUse && inputAssetIdB) throw Error('Inconsistent second input.');
        if (!bitConfig.secondOutputInUse && outputAssetIdB) throw Error('Inconsistent second output.');
        return new BridgeId(addressId, inputAssetIdA, outputAssetIdA, bitConfig.secondInputInUse ? inputAssetIdB : void 0, bitConfig.secondOutputInUse ? outputAssetIdB : void 0, auxData);
    }
    static fromBuffer(buf) {
        if (32 !== buf.length) throw Error('Invalid buffer.');
        return BridgeId.fromBigInt(toBigIntBE(buf));
    }
    static fromString(str) {
        return BridgeId.fromBuffer(Buffer.from(str.replace(/^0x/i, ''), 'hex'));
    }
    get firstInputVirtual() {
        return isVirtualAsset(this.inputAssetIdA);
    }
    get secondInputVirtual() {
        return !!this.inputAssetIdB && isVirtualAsset(this.inputAssetIdB);
    }
    get firstOutputVirtual() {
        return isVirtualAsset(this.outputAssetIdA);
    }
    get secondOutputVirtual() {
        return !!this.outputAssetIdB && isVirtualAsset(this.outputAssetIdB);
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
        return BigInt(this.addressId) + (BigInt(this.inputAssetIdA) << BigInt(INPUT_ASSET_ID_A_OFFSET)) + (BigInt(this.inputAssetIdB || 0) << BigInt(INPUT_ASSET_ID_B_OFFSET)) + (BigInt(this.outputAssetIdA) << BigInt(OUTPUT_ASSET_ID_A_OFFSET)) + (BigInt(this.outputAssetIdB || 0) << BigInt(OUTPUT_ASSET_ID_B_OFFSET)) + (this.bitConfig.toBigInt() << BigInt(BITCONFIG_OFFSET)) + (BigInt(this.auxData) << BigInt(AUX_DATA_OFFSET));
    }
    toBuffer() {
        return toBufferBE(this.toBigInt(), 32);
    }
    toString() {
        return `0x${this.toBuffer().toString('hex')}`;
    }
    equals(id) {
        return id.toBuffer().equals(this.toBuffer());
    }
    constructor(addressId, inputAssetIdA, outputAssetIdA, inputAssetIdB, outputAssetIdB, auxData = 0){
        this.addressId = addressId, this.inputAssetIdA = inputAssetIdA, this.outputAssetIdA = outputAssetIdA, this.inputAssetIdB = inputAssetIdB, this.outputAssetIdB = outputAssetIdB, this.auxData = auxData, this.bitConfig = new BitConfig(void 0 !== inputAssetIdB, void 0 !== outputAssetIdB);
    }
}
BridgeId.ZERO = new BridgeId(0, 0, 0), BridgeId.ENCODED_LENGTH_IN_BYTES = 32;
