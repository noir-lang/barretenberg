"use strict";
function toBigIntLE(buf) {
    let reversed = Buffer.from(buf);
    reversed.reverse();
    let hex = reversed.toString('hex');
    return 0 === hex.length ? BigInt(0) : BigInt(`0x${hex}`);
}
function toBigIntBE(buf) {
    let hex = buf.toString('hex');
    return 0 === hex.length ? BigInt(0) : BigInt(`0x${hex}`);
}
function toBufferLE(num, width) {
    let hex = num.toString(16), buffer = Buffer.from(hex.padStart(2 * width, '0').slice(0, 2 * width), 'hex');
    return buffer.reverse(), buffer;
}
function toBufferBE(num, width) {
    let hex = num.toString(16);
    return Buffer.from(hex.padStart(2 * width, '0').slice(0, 2 * width), 'hex');
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    toBigIntLE: ()=>toBigIntLE,
    toBigIntBE: ()=>toBigIntBE,
    toBufferLE: ()=>toBufferLE,
    toBufferBE: ()=>toBufferBE
});
