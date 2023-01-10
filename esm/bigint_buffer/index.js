export function toBigIntLE(buf) {
    let reversed = Buffer.from(buf);
    reversed.reverse();
    let hex = reversed.toString('hex');
    return 0 === hex.length ? BigInt(0) : BigInt(`0x${hex}`);
}
export function toBigIntBE(buf) {
    let hex = buf.toString('hex');
    return 0 === hex.length ? BigInt(0) : BigInt(`0x${hex}`);
}
export function toBufferLE(num, width) {
    let hex = num.toString(16), buffer = Buffer.from(hex.padStart(2 * width, '0').slice(0, 2 * width), 'hex');
    return buffer.reverse(), buffer;
}
export function toBufferBE(num, width) {
    let hex = num.toString(16);
    return Buffer.from(hex.padStart(2 * width, '0').slice(0, 2 * width), 'hex');
}
