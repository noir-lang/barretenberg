"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "TreeNote", {
    enumerable: !0,
    get: ()=>TreeNote
});
const _address = require("../address"), _bigintBuffer = require("../bigint_buffer"), _serialize = require("../serialize"), _viewingKey = require("../viewing_key"), _deriveNoteSecret = require("./derive_note_secret");
class TreeNote {
    toBuffer() {
        return Buffer.concat([
            (0, _bigintBuffer.toBufferBE)(this.value, 32),
            (0, _serialize.numToUInt32BE)(this.assetId),
            Buffer.from([
                this.accountRequired ? 1 : 0
            ]),
            this.ownerPubKey.toBuffer(),
            this.noteSecret,
            this.creatorPubKey,
            this.inputNullifier
        ]);
    }
    createViewingKey(ephPrivKey, grumpkin) {
        let noteBuf = Buffer.concat([
            (0, _bigintBuffer.toBufferBE)(this.value, 32),
            (0, _serialize.numToUInt32BE)(this.assetId),
            (0, _serialize.numToUInt32BE)(+this.accountRequired),
            this.creatorPubKey
        ]);
        return _viewingKey.ViewingKey.createFromEphPriv(noteBuf, this.ownerPubKey, ephPrivKey, grumpkin);
    }
    static fromBuffer(buf) {
        let dataStart = 0, value = (0, _bigintBuffer.toBigIntBE)(buf.slice(dataStart, dataStart + 32));
        dataStart += 32;
        let assetId = buf.readUInt32BE(dataStart);
        dataStart += 4;
        let accountRequired = !!buf[dataStart];
        dataStart += 1;
        let ownerPubKey = new _address.GrumpkinAddress(buf.slice(dataStart, dataStart + 64));
        dataStart += 64;
        let noteSecret = buf.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let creatorPubKey = buf.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let inputNullifier = buf.slice(dataStart, dataStart + 32);
        return new TreeNote(ownerPubKey, value, assetId, accountRequired, noteSecret, creatorPubKey, inputNullifier);
    }
    static createFromEphPriv(ownerPubKey, value, assetId, accountRequired, inputNullifier, ephPrivKey, grumpkin, creatorPubKey = Buffer.alloc(32)) {
        let noteSecret = (0, _deriveNoteSecret.deriveNoteSecret)(ownerPubKey, ephPrivKey, grumpkin);
        return new TreeNote(ownerPubKey, value, assetId, accountRequired, noteSecret, creatorPubKey, inputNullifier);
    }
    static createFromEphPub(ownerPubKey, value, assetId, accountRequired, inputNullifier, ephPubKey, ownerPrivKey, grumpkin, creatorPubKey = Buffer.alloc(32)) {
        let noteSecret = (0, _deriveNoteSecret.deriveNoteSecret)(ephPubKey, ownerPrivKey, grumpkin);
        return new TreeNote(ownerPubKey, value, assetId, accountRequired, noteSecret, creatorPubKey, inputNullifier);
    }
    static recover({ noteBuf , noteSecret  }, inputNullifier, ownerPubKey) {
        let value = (0, _bigintBuffer.toBigIntBE)(noteBuf.slice(0, 32)), assetId = noteBuf.readUInt32BE(32), accountRequired = !!noteBuf.readUInt32BE(36), creatorPubKey = noteBuf.slice(40, 72);
        return new TreeNote(ownerPubKey, value, assetId, accountRequired, noteSecret, creatorPubKey, inputNullifier);
    }
    constructor(ownerPubKey, value, assetId, accountRequired, noteSecret, creatorPubKey, inputNullifier){
        this.ownerPubKey = ownerPubKey, this.value = value, this.assetId = assetId, this.accountRequired = accountRequired, this.noteSecret = noteSecret, this.creatorPubKey = creatorPubKey, this.inputNullifier = inputNullifier;
    }
}
TreeNote.EMPTY = new TreeNote(_address.GrumpkinAddress.one(), BigInt(0), 0, !1, Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32)), TreeNote.SIZE = TreeNote.EMPTY.toBuffer().length;
