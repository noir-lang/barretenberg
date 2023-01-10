"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "AliasHash", {
    enumerable: !0,
    get: ()=>AliasHash
});
const _crypto = require("../crypto");
class AliasHash {
    static random() {
        return new AliasHash((0, _crypto.randomBytes)(28));
    }
    static fromAlias(alias, blake2s) {
        return new AliasHash(blake2s.hashToField(Buffer.from(alias)).slice(0, 28));
    }
    static fromString(hash) {
        return new AliasHash(Buffer.from(hash.replace(/^0x/i, ''), 'hex'));
    }
    toBuffer() {
        return this.buffer;
    }
    toBuffer32() {
        let buffer = Buffer.alloc(32);
        return this.buffer.copy(buffer, 4), buffer;
    }
    toString() {
        return `0x${this.toBuffer().toString('hex')}`;
    }
    equals(rhs) {
        return this.toBuffer().equals(rhs.toBuffer());
    }
    constructor(buffer){
        if (this.buffer = buffer, buffer.length !== AliasHash.SIZE) throw Error('Invalid alias hash buffer.');
    }
}
AliasHash.SIZE = 28, AliasHash.ZERO = new AliasHash(Buffer.alloc(AliasHash.SIZE));
