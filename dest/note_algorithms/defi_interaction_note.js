"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    DefiInteractionNote: ()=>DefiInteractionNote,
    computeInteractionHashes: ()=>computeInteractionHashes,
    packInteractionNotes: ()=>packInteractionNotes
});
const _crypto = require("crypto"), _bigintBuffer = require("../bigint_buffer"), _bridgeId = require("../bridge_id"), _crypto1 = require("../crypto"), _serialize = require("../serialize");
class DefiInteractionNote {
    static deserialize(buffer, offset) {
        let des = new _serialize.Deserializer(buffer, offset), bridgeIdBuffer = des.buffer(32), bridgeId = _bridgeId.BridgeId.fromBuffer(bridgeIdBuffer), totalInputValue = des.bigInt(), totalOutputValueA = des.bigInt(), totalOutputValueB = des.bigInt(), nonce = des.uInt32(), result = des.bool();
        return {
            elem: new DefiInteractionNote(bridgeId, nonce, totalInputValue, totalOutputValueA, totalOutputValueB, result),
            adv: des.getOffset() - offset
        };
    }
    static random() {
        return new DefiInteractionNote(_bridgeId.BridgeId.random(), (0, _crypto1.randomBytes)(4).readUInt32BE(0), (0, _bigintBuffer.toBigIntBE)((0, _crypto1.randomBytes)(32)), (0, _bigintBuffer.toBigIntBE)((0, _crypto1.randomBytes)(32)), (0, _bigintBuffer.toBigIntBE)((0, _crypto1.randomBytes)(32)), !!Math.round(Math.random()));
    }
    static fromBuffer(buf) {
        return DefiInteractionNote.deserialize(buf, 0).elem;
    }
    toBuffer() {
        let serializer = new _serialize.Serializer();
        return serializer.buffer(this.bridgeId.toBuffer()), serializer.bigInt(this.totalInputValue), serializer.bigInt(this.totalOutputValueA), serializer.bigInt(this.totalOutputValueB), serializer.uInt32(this.nonce), serializer.bool(this.result), serializer.getBuffer();
    }
    equals(note) {
        return this.toBuffer().equals(note.toBuffer());
    }
    constructor(bridgeId, nonce, totalInputValue, totalOutputValueA, totalOutputValueB, result){
        this.bridgeId = bridgeId, this.nonce = nonce, this.totalInputValue = totalInputValue, this.totalOutputValueA = totalOutputValueA, this.totalOutputValueB = totalOutputValueB, this.result = result;
    }
}
DefiInteractionNote.EMPTY = new DefiInteractionNote(_bridgeId.BridgeId.ZERO, 0, BigInt(0), BigInt(0), BigInt(0), !1), DefiInteractionNote.groupModulus = BigInt('21888242871839275222246405745257275088548364400416034343698204186575808495617');
const computeInteractionHashes = (notes, padTo = notes.length)=>{
    notes = [
        ...notes,
        ...Array(padTo - notes.length).fill(DefiInteractionNote.EMPTY)
    ];
    let hash = notes.map((note)=>(0, _crypto.createHash)('sha256').update(Buffer.concat([
            note.bridgeId.toBuffer(),
            (0, _serialize.numToUInt32BE)(note.nonce, 32),
            (0, _bigintBuffer.toBufferBE)(note.totalInputValue, 32),
            (0, _bigintBuffer.toBufferBE)(note.totalOutputValueA, 32),
            (0, _bigintBuffer.toBufferBE)(note.totalOutputValueB, 32),
            Buffer.alloc(31),
            Buffer.from([
                +note.result
            ])
        ])).digest());
    return hash.map((h)=>(0, _bigintBuffer.toBufferBE)(BigInt('0x' + h.toString('hex')) % DefiInteractionNote.groupModulus, 32));
}, packInteractionNotes = (notes, padTo = notes.length)=>{
    let hash = (0, _crypto.createHash)('sha256').update(Buffer.concat(computeInteractionHashes(notes, padTo))).digest();
    return (0, _bigintBuffer.toBufferBE)(BigInt('0x' + hash.toString('hex')) % DefiInteractionNote.groupModulus, 32);
};
