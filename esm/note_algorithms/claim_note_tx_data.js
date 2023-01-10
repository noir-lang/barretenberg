import { toBigIntBE, toBufferBE } from '../bigint_buffer';
import { BridgeId } from '../bridge_id';
export class ClaimNoteTxData {
    toBuffer() {
        return Buffer.concat([
            toBufferBE(this.value, 32),
            this.bridgeId.toBuffer(),
            this.partialStateSecret,
            this.inputNullifier
        ]);
    }
    equals(note) {
        return this.toBuffer().equals(note.toBuffer());
    }
    static fromBuffer(buf) {
        let dataStart = 0, value = toBigIntBE(buf.slice(dataStart, dataStart + 32));
        dataStart += 32;
        let bridgeId = BridgeId.fromBuffer(buf.slice(dataStart, dataStart + 32));
        dataStart += 32;
        let partialStateSecret = buf.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let inputNullifier = buf.slice(dataStart, dataStart + 32);
        return new ClaimNoteTxData(value, bridgeId, partialStateSecret, inputNullifier);
    }
    constructor(value, bridgeId, partialStateSecret, inputNullifier){
        this.value = value, this.bridgeId = bridgeId, this.partialStateSecret = partialStateSecret, this.inputNullifier = inputNullifier;
    }
}
ClaimNoteTxData.EMPTY = new ClaimNoteTxData(BigInt(0), BridgeId.ZERO, Buffer.alloc(32), Buffer.alloc(32)), ClaimNoteTxData.SIZE = ClaimNoteTxData.EMPTY.toBuffer().length;
