import { GrumpkinAddress } from '../address';
import { toBigIntBE, toBufferBE } from '../bigint_buffer';
import { BridgeId } from '../bridge_id';
import { numToUInt32BE } from '../serialize';
import { ViewingKey } from '../viewing_key';
export class OffchainDefiDepositData {
    static fromBuffer(buf) {
        if (buf.length !== OffchainDefiDepositData.SIZE) throw Error('Invalid buffer size.');
        let dataStart = 0, bridgeId = BridgeId.fromBuffer(buf.slice(dataStart, dataStart + 32));
        dataStart += 32;
        let partialState = buf.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let partialStateSecretEphPubKey = new GrumpkinAddress(buf.slice(dataStart, dataStart + 64));
        dataStart += 64;
        let depositValue = toBigIntBE(buf.slice(dataStart, dataStart + 32));
        dataStart += 32;
        let txFee = toBigIntBE(buf.slice(dataStart, dataStart + 32));
        dataStart += 32;
        let viewingKey = new ViewingKey(buf.slice(dataStart, dataStart + ViewingKey.SIZE));
        dataStart += ViewingKey.SIZE;
        let txRefNo = buf.readUInt32BE(dataStart);
        return new OffchainDefiDepositData(bridgeId, partialState, partialStateSecretEphPubKey, depositValue, txFee, viewingKey, txRefNo);
    }
    toBuffer() {
        return Buffer.concat([
            this.bridgeId.toBuffer(),
            this.partialState,
            this.partialStateSecretEphPubKey.toBuffer(),
            toBufferBE(this.depositValue, 32),
            toBufferBE(this.txFee, 32),
            this.viewingKey.toBuffer(),
            numToUInt32BE(this.txRefNo)
        ]);
    }
    constructor(bridgeId, partialState, partialStateSecretEphPubKey, depositValue, txFee, viewingKey, txRefNo = 0){
        if (this.bridgeId = bridgeId, this.partialState = partialState, this.partialStateSecretEphPubKey = partialStateSecretEphPubKey, this.depositValue = depositValue, this.txFee = txFee, this.viewingKey = viewingKey, this.txRefNo = txRefNo, 32 !== partialState.length) throw Error('Expect partialState to be 32 bytes.');
        if (viewingKey.isEmpty()) throw Error('Viewing key cannot be empty.');
    }
}
OffchainDefiDepositData.EMPTY = new OffchainDefiDepositData(BridgeId.ZERO, Buffer.alloc(32), GrumpkinAddress.ZERO, BigInt(0), BigInt(0), new ViewingKey(Buffer.alloc(ViewingKey.SIZE))), OffchainDefiDepositData.SIZE = OffchainDefiDepositData.EMPTY.toBuffer().length;
