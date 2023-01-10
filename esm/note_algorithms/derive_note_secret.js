import { createHash } from 'crypto';
import { numToUInt8 } from '../serialize';
export function deriveNoteSecret(ecdhPubKey, ecdhPrivKey, grumpkin) {
    let sharedSecret = grumpkin.mul(ecdhPubKey.toBuffer(), ecdhPrivKey), secretBufferA = Buffer.concat([
        sharedSecret,
        numToUInt8(2)
    ]), secretBufferB = Buffer.concat([
        sharedSecret,
        numToUInt8(3)
    ]), hashA = createHash('sha256').update(secretBufferA).digest(), hashB = createHash('sha256').update(secretBufferB).digest(), hash = Buffer.concat([
        hashA,
        hashB
    ]);
    return grumpkin.reduce512BufferToFr(hash);
}
