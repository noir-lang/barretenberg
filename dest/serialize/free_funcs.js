"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    boolToByte: ()=>boolToByte,
    numToUInt32BE: ()=>numToUInt32BE,
    numToInt32BE: ()=>numToInt32BE,
    numToUInt8: ()=>numToUInt8,
    serializeBufferToVector: ()=>serializeBufferToVector,
    serializeBigInt: ()=>serializeBigInt,
    deserializeBigInt: ()=>deserializeBigInt,
    serializeDate: ()=>serializeDate,
    deserializeBufferFromVector: ()=>deserializeBufferFromVector,
    deserializeBool: ()=>deserializeBool,
    deserializeUInt32: ()=>deserializeUInt32,
    deserializeInt32: ()=>deserializeInt32,
    deserializeField: ()=>deserializeField,
    serializeBufferArrayToVector: ()=>serializeBufferArrayToVector,
    deserializeArrayFromVector: ()=>deserializeArrayFromVector
});
const _bigintBuffer = require("../bigint_buffer");
function boolToByte(b) {
    let buf = Buffer.alloc(1);
    return buf.writeUInt8(b ? 1 : 0), buf;
}
function numToUInt32BE(n, bufferSize = 4) {
    let buf = Buffer.alloc(bufferSize);
    return buf.writeUInt32BE(n, bufferSize - 4), buf;
}
function numToInt32BE(n, bufferSize = 4) {
    let buf = Buffer.alloc(bufferSize);
    return buf.writeInt32BE(n, bufferSize - 4), buf;
}
function numToUInt8(n) {
    let buf = Buffer.alloc(1);
    return buf.writeUInt8(n, 0), buf;
}
function serializeBufferToVector(buf) {
    let lengthBuf = Buffer.alloc(4);
    return lengthBuf.writeUInt32BE(buf.length, 0), Buffer.concat([
        lengthBuf,
        buf
    ]);
}
function serializeBigInt(n, width = 32) {
    return (0, _bigintBuffer.toBufferBE)(n, width);
}
function deserializeBigInt(buf, offset = 0, width = 32) {
    return {
        elem: (0, _bigintBuffer.toBigIntBE)(buf.slice(offset, offset + width)),
        adv: width
    };
}
function serializeDate(date) {
    return serializeBigInt(BigInt(date.getTime()), 8);
}
function deserializeBufferFromVector(vector, offset = 0) {
    let length = vector.readUInt32BE(offset), adv = 4 + length;
    return {
        elem: vector.slice(offset + 4, offset + adv),
        adv
    };
}
function deserializeBool(buf, offset = 0) {
    return {
        elem: buf.readUInt8(offset),
        adv: 1
    };
}
function deserializeUInt32(buf, offset = 0) {
    return {
        elem: buf.readUInt32BE(offset),
        adv: 4
    };
}
function deserializeInt32(buf, offset = 0) {
    return {
        elem: buf.readInt32BE(offset),
        adv: 4
    };
}
function deserializeField(buf, offset = 0) {
    return {
        elem: buf.slice(offset, offset + 32),
        adv: 32
    };
}
function serializeBufferArrayToVector(arr) {
    let lengthBuf = Buffer.alloc(4);
    return lengthBuf.writeUInt32BE(arr.length, 0), Buffer.concat([
        lengthBuf,
        ...arr
    ]);
}
function deserializeArrayFromVector(deserialize, vector, offset = 0) {
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
