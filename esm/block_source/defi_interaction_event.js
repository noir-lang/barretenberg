import { DefiInteractionNote } from '../note_algorithms';
import { toBigIntBE } from '../bigint_buffer';
import { BridgeId } from '../bridge_id';
import { randomBytes } from '../crypto';
import { Deserializer, Serializer } from '../serialize';
export class DefiInteractionEvent {
    static deserialize(buffer, offset) {
        let des = new Deserializer(buffer, offset), bridgeIdBuffer = des.buffer(32), bridgeId = BridgeId.fromBuffer(bridgeIdBuffer), totalInputValue = des.bigInt(), totalOutputValueA = des.bigInt(), totalOutputValueB = des.bigInt(), nonce = des.uInt32(), result = des.bool(), errorReason = des.vector();
        return {
            elem: new DefiInteractionEvent(bridgeId, nonce, totalInputValue, totalOutputValueA, totalOutputValueB, result, errorReason),
            adv: des.getOffset() - offset
        };
    }
    static random() {
        return new DefiInteractionEvent(BridgeId.random(), randomBytes(4).readUInt32BE(0), toBigIntBE(randomBytes(32)), toBigIntBE(randomBytes(32)), toBigIntBE(randomBytes(32)), !!Math.round(Math.random()));
    }
    static fromBuffer(buf) {
        return DefiInteractionEvent.deserialize(buf, 0).elem;
    }
    toBuffer() {
        let serializer = new Serializer();
        return serializer.buffer(this.bridgeId.toBuffer()), serializer.bigInt(this.totalInputValue), serializer.bigInt(this.totalOutputValueA), serializer.bigInt(this.totalOutputValueB), serializer.uInt32(this.nonce), serializer.bool(this.result), serializer.vector(this.errorReason), serializer.getBuffer();
    }
    equals(note) {
        return this.toBuffer().equals(note.toBuffer());
    }
    toDefiInteractionNote() {
        return new DefiInteractionNote(this.bridgeId, this.nonce, this.totalInputValue, this.totalOutputValueA, this.totalOutputValueB, this.result);
    }
    constructor(bridgeId, nonce, totalInputValue, totalOutputValueA, totalOutputValueB, result, errorReason = Buffer.alloc(0)){
        this.bridgeId = bridgeId, this.nonce = nonce, this.totalInputValue = totalInputValue, this.totalOutputValueA = totalOutputValueA, this.totalOutputValueB = totalOutputValueB, this.result = result, this.errorReason = errorReason;
    }
}
DefiInteractionEvent.EMPTY = new DefiInteractionEvent(BridgeId.ZERO, 0, BigInt(0), BigInt(0), BigInt(0), !1);
