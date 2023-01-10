"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _crypto = require("crypto"), _address = require("../address"), _grumpkin = require("../ecc/grumpkin"), _viewingKey = require("../viewing_key"), _wasm = require("../wasm"), _batchDecryptNotes = require("./batch_decrypt_notes"), _noteDecryptor = require("./note_decryptor");
describe('batch_decypt_notes', ()=>{
    let grumpkin, noteDecryptor, singleNoteDecryptor;
    let createKeyPair = ()=>{
        let privKey = grumpkin.getRandomFr(), pubKey = new _address.GrumpkinAddress(grumpkin.mul(_grumpkin.Grumpkin.one, privKey));
        return {
            privKey,
            pubKey
        };
    };
    beforeAll(async ()=>{
        let wasm = await _wasm.BarretenbergWasm.new();
        grumpkin = new _grumpkin.Grumpkin(wasm);
        let pool = await _wasm.WorkerPool.new(wasm, 4);
        noteDecryptor = new _noteDecryptor.PooledNoteDecryptor(pool), singleNoteDecryptor = new _noteDecryptor.SingleNoteDecryptor(wasm);
    }), it('batch decrypt multiple viewing keys', async ()=>{
        let owner = createKeyPair(), eph = createKeyPair(), noteBufs = Array(10).fill(0).map(()=>(0, _crypto.randomBytes)(72)), keys = noteBufs.map((noteBuf)=>_viewingKey.ViewingKey.createFromEphPriv(noteBuf, owner.pubKey, eph.privKey, grumpkin)), keysBuf = Buffer.concat(keys.map((k)=>k.toBuffer()));
        {
            let decryptedNotes = await (0, _batchDecryptNotes.batchDecryptNotes)(keysBuf, owner.privKey, singleNoteDecryptor, grumpkin);
            expect(decryptedNotes.length).toBe(noteBufs.length), decryptedNotes.forEach((decrypted, i)=>{
                expect(decrypted.noteBuf).toEqual(noteBufs[i]), expect(decrypted.ephPubKey).toEqual(eph.pubKey);
            });
        }
        {
            let decryptedNotes1 = await (0, _batchDecryptNotes.batchDecryptNotes)(keysBuf, owner.privKey, noteDecryptor, grumpkin);
            expect(decryptedNotes1.length).toBe(noteBufs.length), decryptedNotes1.forEach((decrypted, i)=>{
                expect(decrypted.noteBuf).toEqual(noteBufs[i]), expect(decrypted.ephPubKey).toEqual(eph.pubKey);
            });
        }
    }), it('batch decrypt owned and unknown viewing keys', async ()=>{
        let owner = createKeyPair(), eph = createKeyPair(), noteBufs = [
            ,
            ,
            ,
            , 
        ].fill(0).map(()=>(0, _crypto.randomBytes)(72)), keys = noteBufs.map((noteBuf)=>_viewingKey.ViewingKey.createFromEphPriv(noteBuf, owner.pubKey, eph.privKey, grumpkin));
        keys.splice(2, 1, _viewingKey.ViewingKey.random()), keys.push(_viewingKey.ViewingKey.random());
        let keysBuf = Buffer.concat(keys.map((k)=>k.toBuffer())), decryptedNotes = await (0, _batchDecryptNotes.batchDecryptNotes)(keysBuf, owner.privKey, noteDecryptor, grumpkin);
        expect(decryptedNotes.length).toBe(noteBufs.length), decryptedNotes.forEach((decrypted, i)=>{
            2 === i ? expect(decrypted).toBe(void 0) : (expect(decrypted.noteBuf).toEqual(noteBufs[i]), expect(decrypted.ephPubKey).toEqual(eph.pubKey));
        });
    });
});
