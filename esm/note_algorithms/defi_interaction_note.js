import { createHash } from 'crypto';
import { toBigIntBE, toBufferBE } from '../bigint_buffer';
import { BridgeId } from '../bridge_id';
import { randomBytes } from '../crypto';
import { numToUInt32BE, Deserializer, Serializer } from '../serialize';
export class DefiInteractionNote {
    static deserialize(buffer, offset) {
        let des = new Deserializer(buffer, offset), bridgeIdBuffer = des.buffer(32), bridgeId = BridgeId.fromBuffer(bridgeIdBuffer), totalInputValue = des.bigInt(), totalOutputValueA = des.bigInt(), totalOutputValueB = des.bigInt(), nonce = des.uInt32(), result = des.bool();
        return {
            elem: new DefiInteractionNote(bridgeId, nonce, totalInputValue, totalOutputValueA, totalOutputValueB, result),
            adv: des.getOffset() - offset
        };
    }
    static random() {
        return new DefiInteractionNote(BridgeId.random(), randomBytes(4).readUInt32BE(0), toBigIntBE(randomBytes(32)), toBigIntBE(randomBytes(32)), toBigIntBE(randomBytes(32)), !!Math.round(Math.random()));
    }
    static fromBuffer(buf) {
        return DefiInteractionNote.deserialize(buf, 0).elem;
    }
    toBuffer() {
        let serializer = new Serializer();
        return serializer.buffer(this.bridgeId.toBuffer()), serializer.bigInt(this.totalInputValue), serializer.bigInt(this.totalOutputValueA), serializer.bigInt(this.totalOutputValueB), serializer.uInt32(this.nonce), serializer.bool(this.result), serializer.getBuffer();
    }
    equals(note) {
        return this.toBuffer().equals(note.toBuffer());
    }
    constructor(bridgeId, nonce, totalInputValue, totalOutputValueA, totalOutputValueB, result){
        this.bridgeId = bridgeId, this.nonce = nonce, this.totalInputValue = totalInputValue, this.totalOutputValueA = totalOutputValueA, this.totalOutputValueB = totalOutputValueB, this.result = result;
    }
}
DefiInteractionNote.EMPTY = new DefiInteractionNote(BridgeId.ZERO, 0, BigInt(0), BigInt(0), BigInt(0), !1), DefiInteractionNote.groupModulus = BigInt('21888242871839275222246405745257275088548364400416034343698204186575808495617');
export const computeInteractionHashes = (notes, padTo = notes.length)=>{
    notes = [
        ...notes,
        ...Array(padTo - notes.length).fill(DefiInteractionNote.EMPTY)
    ];
    let hash = notes.map((note)=>createHash('sha256').update(Buffer.concat([
            note.bridgeId.toBuffer(),
            numToUInt32BE(note.nonce, 32),
            toBufferBE(note.totalInputValue, 32),
            toBufferBE(note.totalOutputValueA, 32),
            toBufferBE(note.totalOutputValueB, 32),
            Buffer.alloc(31),
            Buffer.from([
                +note.result
            ])
        ])).digest());
    return hash.map((h)=>toBufferBE(BigInt('0x' + h.toString('hex')) % DefiInteractionNote.groupModulus, 32));
};
export const packInteractionNotes = (notes, padTo = notes.length)=>{
    let hash = createHash('sha256').update(Buffer.concat(computeInteractionHashes(notes, padTo))).digest();
    return toBufferBE(BigInt('0x' + hash.toString('hex')) % DefiInteractionNote.groupModulus, 32);
};
