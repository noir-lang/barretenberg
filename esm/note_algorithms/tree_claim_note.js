import { toBigIntBE, toBufferBE } from '../bigint_buffer';
import { BridgeId } from '../bridge_id';
import { randomBytes } from '../crypto';
import { numToUInt32BE } from '../serialize';
export class TreeClaimNote {
    static random() {
        return new TreeClaimNote(toBigIntBE(randomBytes(32)), BridgeId.random(), randomBytes(4).readUInt32BE(0), toBigIntBE(randomBytes(32)), randomBytes(32), randomBytes(32));
    }
    static deserialize(buf, offset) {
        return {
            elem: TreeClaimNote.fromBuffer(buf.slice(offset, offset + TreeClaimNote.LENGTH)),
            adv: TreeClaimNote.LENGTH
        };
    }
    static fromBuffer(buf) {
        let value = toBigIntBE(buf.slice(0, 32)), offset = 32, bridgeId = BridgeId.fromBuffer(buf.slice(offset, offset + BridgeId.ENCODED_LENGTH_IN_BYTES));
        offset += 32;
        let defiInteractionNonce = buf.readUInt32BE(offset);
        offset += 4;
        let fee = toBigIntBE(buf.slice(offset, offset + 32));
        offset += 32;
        let partialState = buf.slice(offset, offset + 32);
        offset += 32;
        let inputNullifier = buf.slice(offset, offset + 32);
        return new TreeClaimNote(value, bridgeId, defiInteractionNonce, fee, partialState, inputNullifier);
    }
    toBuffer() {
        return Buffer.concat([
            toBufferBE(this.value, 32),
            this.bridgeId.toBuffer(),
            numToUInt32BE(this.defiInteractionNonce),
            toBufferBE(this.fee, 32),
            this.partialState,
            this.inputNullifier
        ]);
    }
    equals(note) {
        return this.toBuffer().equals(note.toBuffer());
    }
    constructor(value, bridgeId, defiInteractionNonce, fee, partialState, inputNullifier){
        this.value = value, this.bridgeId = bridgeId, this.defiInteractionNonce = defiInteractionNonce, this.fee = fee, this.partialState = partialState, this.inputNullifier = inputNullifier;
    }
}
TreeClaimNote.EMPTY = new TreeClaimNote(BigInt(0), BridgeId.ZERO, 0, BigInt(0), Buffer.alloc(32), Buffer.alloc(32)), TreeClaimNote.LENGTH = TreeClaimNote.EMPTY.toBuffer().length;
