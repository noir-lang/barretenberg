"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "deriveNoteSecret", {
    enumerable: !0,
    get: ()=>deriveNoteSecret
});
const _crypto = require("crypto"), _serialize = require("../serialize");
function deriveNoteSecret(ecdhPubKey, ecdhPrivKey, grumpkin) {
    let sharedSecret = grumpkin.mul(ecdhPubKey.toBuffer(), ecdhPrivKey), secretBufferA = Buffer.concat([
        sharedSecret,
        (0, _serialize.numToUInt8)(2)
    ]), secretBufferB = Buffer.concat([
        sharedSecret,
        (0, _serialize.numToUInt8)(3)
    ]), hashA = (0, _crypto.createHash)('sha256').update(secretBufferA).digest(), hashB = (0, _crypto.createHash)('sha256').update(secretBufferB).digest(), hash = Buffer.concat([
        hashA,
        hashB
    ]);
    return grumpkin.reduce512BufferToFr(hash);
}
