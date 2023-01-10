import { GrumpkinAddress } from '../address';
import { toBigIntBE, toBufferBE } from '../bigint_buffer';
import { numToUInt32BE } from '../serialize';
import { ViewingKey } from '../viewing_key';
import { deriveNoteSecret } from './derive_note_secret';
export class TreeNote {
    toBuffer() {
        return Buffer.concat([
            toBufferBE(this.value, 32),
            numToUInt32BE(this.assetId),
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
            toBufferBE(this.value, 32),
            numToUInt32BE(this.assetId),
            numToUInt32BE(+this.accountRequired),
            this.creatorPubKey
        ]);
        return ViewingKey.createFromEphPriv(noteBuf, this.ownerPubKey, ephPrivKey, grumpkin);
    }
    static fromBuffer(buf) {
        let dataStart = 0, value = toBigIntBE(buf.slice(dataStart, dataStart + 32));
        dataStart += 32;
        let assetId = buf.readUInt32BE(dataStart);
        dataStart += 4;
        let accountRequired = !!buf[dataStart];
        dataStart += 1;
        let ownerPubKey = new GrumpkinAddress(buf.slice(dataStart, dataStart + 64));
        dataStart += 64;
        let noteSecret = buf.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let creatorPubKey = buf.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let inputNullifier = buf.slice(dataStart, dataStart + 32);
        return new TreeNote(ownerPubKey, value, assetId, accountRequired, noteSecret, creatorPubKey, inputNullifier);
    }
    static createFromEphPriv(ownerPubKey, value, assetId, accountRequired, inputNullifier, ephPrivKey, grumpkin, creatorPubKey = Buffer.alloc(32)) {
        let noteSecret = deriveNoteSecret(ownerPubKey, ephPrivKey, grumpkin);
        return new TreeNote(ownerPubKey, value, assetId, accountRequired, noteSecret, creatorPubKey, inputNullifier);
    }
    static createFromEphPub(ownerPubKey, value, assetId, accountRequired, inputNullifier, ephPubKey, ownerPrivKey, grumpkin, creatorPubKey = Buffer.alloc(32)) {
        let noteSecret = deriveNoteSecret(ephPubKey, ownerPrivKey, grumpkin);
        return new TreeNote(ownerPubKey, value, assetId, accountRequired, noteSecret, creatorPubKey, inputNullifier);
    }
    static recover({ noteBuf , noteSecret  }, inputNullifier, ownerPubKey) {
        let value = toBigIntBE(noteBuf.slice(0, 32)), assetId = noteBuf.readUInt32BE(32), accountRequired = !!noteBuf.readUInt32BE(36), creatorPubKey = noteBuf.slice(40, 72);
        return new TreeNote(ownerPubKey, value, assetId, accountRequired, noteSecret, creatorPubKey, inputNullifier);
    }
    constructor(ownerPubKey, value, assetId, accountRequired, noteSecret, creatorPubKey, inputNullifier){
        this.ownerPubKey = ownerPubKey, this.value = value, this.assetId = assetId, this.accountRequired = accountRequired, this.noteSecret = noteSecret, this.creatorPubKey = creatorPubKey, this.inputNullifier = inputNullifier;
    }
}
TreeNote.EMPTY = new TreeNote(GrumpkinAddress.one(), BigInt(0), 0, !1, Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32)), TreeNote.SIZE = TreeNote.EMPTY.toBuffer().length;
