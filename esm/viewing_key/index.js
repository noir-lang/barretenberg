import { createCipheriv, createHash } from 'crypto';
import { randomBytes } from '../crypto';
import { Grumpkin } from '../ecc/grumpkin';
import { numToUInt8 } from '../serialize';
export class ViewingKey {
    static fromString(str) {
        return new ViewingKey(Buffer.from(str, 'hex'));
    }
    static random() {
        return new ViewingKey(randomBytes(ViewingKey.SIZE));
    }
    static createFromEphPriv(noteBuf, ownerPubKey, ephPrivKey, grumpkin) {
        if (72 !== noteBuf.length) throw Error('Invalid note buffer.');
        let ephPubKey = grumpkin.mul(Grumpkin.one, ephPrivKey), aesSecret = function(ecdhPubKey, ecdhPrivKey, grumpkin) {
            let sharedSecret = grumpkin.mul(ecdhPubKey.toBuffer(), ecdhPrivKey), secretBuffer = Buffer.concat([
                sharedSecret,
                numToUInt8(1)
            ]), hash = createHash('sha256').update(secretBuffer).digest();
            return hash;
        }(ownerPubKey, ephPrivKey, grumpkin), aesKey = aesSecret.slice(0, 16), iv = aesSecret.slice(16, 32), cipher = createCipheriv('aes-128-cbc', aesKey, iv);
        cipher.setAutoPadding(!1);
        let plaintext = Buffer.concat([
            iv.slice(0, 8),
            noteBuf
        ]);
        return new ViewingKey(Buffer.concat([
            cipher.update(plaintext),
            cipher.final(),
            ephPubKey
        ]));
    }
    isEmpty() {
        return 0 === this.buffer.length;
    }
    equals(rhs) {
        return this.buffer.equals(rhs.buffer);
    }
    toBuffer() {
        return this.buffer;
    }
    toString() {
        return this.toBuffer().toString('hex');
    }
    constructor(buffer){
        if (buffer && buffer.length > 0) {
            if (buffer.length !== ViewingKey.SIZE) throw Error('Invalid hash buffer.');
            this.buffer = buffer;
        } else this.buffer = Buffer.alloc(0);
    }
}
ViewingKey.SIZE = 144, ViewingKey.EMPTY = new ViewingKey();
