import { toBigIntBE, toBufferBE } from '../bigint_buffer';
export function boolToByte(b) {
    let buf = Buffer.alloc(1);
    return buf.writeUInt8(b ? 1 : 0), buf;
}
export function numToUInt32BE(n, bufferSize = 4) {
    let buf = Buffer.alloc(bufferSize);
    return buf.writeUInt32BE(n, bufferSize - 4), buf;
}
export function numToInt32BE(n, bufferSize = 4) {
    let buf = Buffer.alloc(bufferSize);
    return buf.writeInt32BE(n, bufferSize - 4), buf;
}
export function numToUInt8(n) {
    let buf = Buffer.alloc(1);
    return buf.writeUInt8(n, 0), buf;
}
export function serializeBufferToVector(buf) {
    let lengthBuf = Buffer.alloc(4);
    return lengthBuf.writeUInt32BE(buf.length, 0), Buffer.concat([
        lengthBuf,
        buf
    ]);
}
export function serializeBigInt(n, width = 32) {
    return toBufferBE(n, width);
}
export function deserializeBigInt(buf, offset = 0, width = 32) {
    return {
        elem: toBigIntBE(buf.slice(offset, offset + width)),
        adv: width
    };
}
export function serializeDate(date) {
    return serializeBigInt(BigInt(date.getTime()), 8);
}
export function deserializeBufferFromVector(vector, offset = 0) {
    let length = vector.readUInt32BE(offset), adv = 4 + length;
    return {
        elem: vector.slice(offset + 4, offset + adv),
        adv
    };
}
export function deserializeBool(buf, offset = 0) {
    return {
        elem: buf.readUInt8(offset),
        adv: 1
    };
}
export function deserializeUInt32(buf, offset = 0) {
    return {
        elem: buf.readUInt32BE(offset),
        adv: 4
    };
}
export function deserializeInt32(buf, offset = 0) {
    return {
        elem: buf.readInt32BE(offset),
        adv: 4
    };
}
export function deserializeField(buf, offset = 0) {
    return {
        elem: buf.slice(offset, offset + 32),
        adv: 32
    };
}
export function serializeBufferArrayToVector(arr) {
    let lengthBuf = Buffer.alloc(4);
    return lengthBuf.writeUInt32BE(arr.length, 0), Buffer.concat([
        lengthBuf,
        ...arr
    ]);
}
export function deserializeArrayFromVector(deserialize, vector, offset = 0) {
    let pos = offset, size = vector.readUInt32BE(pos);
    pos += 4;
    let arr = Array(size);
    for(let i = 0; i < size; ++i){
        let { elem , adv  } = deserialize(vector, pos);
        pos += adv, arr[i] = elem;
    }
    return {
        elem: arr,
        adv: pos - offset
    };
}
