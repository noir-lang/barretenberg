"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "Deserializer", {
    enumerable: !0,
    get: ()=>Deserializer
});
const _freeFuncs = require("./free_funcs");
class Deserializer {
    bool() {
        return !!this.exec(_freeFuncs.deserializeBool);
    }
    uInt32() {
        return this.exec(_freeFuncs.deserializeUInt32);
    }
    int32() {
        return this.exec(_freeFuncs.deserializeInt32);
    }
    bigInt(width = 32) {
        return this.exec((buf, offset)=>(0, _freeFuncs.deserializeBigInt)(buf, offset, width));
    }
    vector() {
        return this.exec(_freeFuncs.deserializeBufferFromVector);
    }
    buffer(width) {
        let buf = this.buf.slice(this.offset, this.offset + width);
        return this.offset += width, buf;
    }
    string() {
        return this.vector().toString();
    }
    date() {
        return new Date(Number(this.bigInt(8)));
    }
    deserializeArray(fn) {
        return this.exec((buf, offset)=>(0, _freeFuncs.deserializeArrayFromVector)(fn, buf, offset));
    }
    exec(fn) {
        let { elem , adv  } = fn(this.buf, this.offset);
        return this.offset += adv, elem;
    }
    getOffset() {
        return this.offset;
    }
    constructor(buf, offset = 0){
        this.buf = buf, this.offset = offset;
    }
}
