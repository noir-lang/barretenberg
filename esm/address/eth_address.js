import { Keccak } from 'sha3';
import { randomBytes } from '../crypto';
let hash = new Keccak(256);
function sha3(input) {
    return hash.reset(), hash.update(input), hash.digest('hex');
}
export class EthAddress {
    static fromString(address) {
        if (!EthAddress.isAddress(address)) throw Error(`Invalid address string: ${address}`);
        return new EthAddress(Buffer.from(address.replace(/^0x/i, ''), 'hex'));
    }
    static random() {
        return new EthAddress(randomBytes(20));
    }
    static isAddress(address) {
        return !!/^(0x)?[0-9a-f]{40}$/i.test(address) && (!!(/^(0x|0X)?[0-9a-f]{40}$/.test(address) || /^(0x|0X)?[0-9A-F]{40}$/.test(address)) || EthAddress.checkAddressChecksum(address));
    }
    isZero() {
        return this.equals(EthAddress.ZERO);
    }
    static checkAddressChecksum(address) {
        address = address.replace(/^0x/i, '');
        let addressHash = sha3(address.toLowerCase());
        for(let i = 0; i < 40; i++)if (parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i] || 7 >= parseInt(addressHash[i], 16) && address[i].toLowerCase() !== address[i]) return !1;
        return !0;
    }
    static toChecksumAddress(address) {
        if (!EthAddress.isAddress(address)) throw Error('Invalid address string.');
        address = address.toLowerCase().replace(/^0x/i, '');
        let addressHash = sha3(address), checksumAddress = '0x';
        for(let i = 0; i < address.length; i++)parseInt(addressHash[i], 16) > 7 ? checksumAddress += address[i].toUpperCase() : checksumAddress += address[i];
        return checksumAddress;
    }
    equals(rhs) {
        return this.buffer.equals(rhs.toBuffer());
    }
    toString() {
        return EthAddress.toChecksumAddress(this.buffer.toString('hex'));
    }
    toBuffer() {
        return this.buffer;
    }
    toBuffer32() {
        let buffer = Buffer.alloc(32);
        return this.buffer.copy(buffer, 12), buffer;
    }
    constructor(buffer){
        if (this.buffer = buffer, 32 === buffer.length) {
            if (buffer.slice(0, 12).equals(Buffer.alloc(12))) this.buffer = buffer.slice(12);
            else throw Error('Invalid address buffer.');
        } else if (20 !== buffer.length) throw Error('Invalid address buffer.');
    }
}
EthAddress.ZERO = new EthAddress(Buffer.alloc(20));
