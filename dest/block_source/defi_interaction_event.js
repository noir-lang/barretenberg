"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "DefiInteractionEvent", {
    enumerable: !0,
    get: ()=>DefiInteractionEvent
});
const _noteAlgorithms = require("../note_algorithms"), _bigintBuffer = require("../bigint_buffer"), _bridgeId = require("../bridge_id"), _crypto = require("../crypto"), _serialize = require("../serialize");
class DefiInteractionEvent {
    static deserialize(buffer, offset) {
        let des = new _serialize.Deserializer(buffer, offset), bridgeIdBuffer = des.buffer(32), bridgeId = _bridgeId.BridgeId.fromBuffer(bridgeIdBuffer), totalInputValue = des.bigInt(), totalOutputValueA = des.bigInt(), totalOutputValueB = des.bigInt(), nonce = des.uInt32(), result = des.bool(), errorReason = des.vector();
        return {
            elem: new DefiInteractionEvent(bridgeId, nonce, totalInputValue, totalOutputValueA, totalOutputValueB, result, errorReason),
            adv: des.getOffset() - offset
        };
    }
    static random() {
        return new DefiInteractionEvent(_bridgeId.BridgeId.random(), (0, _crypto.randomBytes)(4).readUInt32BE(0), (0, _bigintBuffer.toBigIntBE)((0, _crypto.randomBytes)(32)), (0, _bigintBuffer.toBigIntBE)((0, _crypto.randomBytes)(32)), (0, _bigintBuffer.toBigIntBE)((0, _crypto.randomBytes)(32)), !!Math.round(Math.random()));
    }
    static fromBuffer(buf) {
        return DefiInteractionEvent.deserialize(buf, 0).elem;
    }
    toBuffer() {
        let serializer = new _serialize.Serializer();
        return serializer.buffer(this.bridgeId.toBuffer()), serializer.bigInt(this.totalInputValue), serializer.bigInt(this.totalOutputValueA), serializer.bigInt(this.totalOutputValueB), serializer.uInt32(this.nonce), serializer.bool(this.result), serializer.vector(this.errorReason), serializer.getBuffer();
    }
    equals(note) {
        return this.toBuffer().equals(note.toBuffer());
    }
    toDefiInteractionNote() {
        return new _noteAlgorithms.DefiInteractionNote(this.bridgeId, this.nonce, this.totalInputValue, this.totalOutputValueA, this.totalOutputValueB, this.result);
    }
    constructor(bridgeId, nonce, totalInputValue, totalOutputValueA, totalOutputValueB, result, errorReason = Buffer.alloc(0)){
        this.bridgeId = bridgeId, this.nonce = nonce, this.totalInputValue = totalInputValue, this.totalOutputValueA = totalOutputValueA, this.totalOutputValueB = totalOutputValueB, this.result = result, this.errorReason = errorReason;
    }
}
DefiInteractionEvent.EMPTY = new DefiInteractionEvent(_bridgeId.BridgeId.ZERO, 0, BigInt(0), BigInt(0), BigInt(0), !1);
