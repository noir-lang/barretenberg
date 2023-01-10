"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "Serializer", {
    enumerable: !0,
    get: ()=>Serializer
});
const _ = require("."), _freeFuncs = require("./free_funcs");
class Serializer {
    bool(bool) {
        this.buf.push((0, _freeFuncs.boolToByte)(bool));
    }
    uInt32(num) {
        this.buf.push((0, _freeFuncs.numToUInt32BE)(num));
    }
    int32(num) {
        this.buf.push((0, _freeFuncs.numToInt32BE)(num));
    }
    bigInt(num) {
        this.buf.push((0, _freeFuncs.serializeBigInt)(num));
    }
    vector(buf) {
        this.buf.push((0, _freeFuncs.serializeBufferToVector)(buf));
    }
    buffer(buf) {
        this.buf.push(buf);
    }
    string(str) {
        this.vector(Buffer.from(str));
    }
    date(date) {
        this.buf.push((0, _freeFuncs.serializeDate)(date));
    }
    getBuffer() {
        return Buffer.concat(this.buf);
    }
    serializeArray(arr) {
        this.buf.push((0, _.serializeBufferArrayToVector)(arr.map((e)=>e.toBuffer())));
    }
    constructor(){
        this.buf = [];
    }
}
