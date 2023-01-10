"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "TxHash", {
    enumerable: !0,
    get: ()=>TxHash
});
const _crypto = require("../crypto");
class TxHash {
    static fromBuffer(buffer) {
        return new TxHash(buffer);
    }
    static deserialize(buffer, offset) {
        return {
            elem: new TxHash(buffer.slice(offset, offset + 32)),
            adv: 32
        };
    }
    static fromString(hash) {
        return new TxHash(Buffer.from(hash.replace(/^0x/i, ''), 'hex'));
    }
    static random() {
        return new TxHash((0, _crypto.randomBytes)(32));
    }
    equals(rhs) {
        return this.toBuffer().equals(rhs.toBuffer());
    }
    toBuffer() {
        return this.buffer;
    }
    toString() {
        return `0x${this.toBuffer().toString('hex')}`;
    }
    constructor(buffer){
        if (this.buffer = buffer, 32 !== buffer.length) throw Error('Invalid hash buffer.');
    }
}
