import { randomBytes } from 'crypto';
import { GrumpkinAddress } from '../address';
import { Grumpkin } from '../ecc/grumpkin';
import { ViewingKey } from '../viewing_key';
import { BarretenbergWasm, WorkerPool } from '../wasm';
import { batchDecryptNotes } from './batch_decrypt_notes';
import { PooledNoteDecryptor, SingleNoteDecryptor } from './note_decryptor';
describe('batch_decypt_notes', ()=>{
    let grumpkin, noteDecryptor, singleNoteDecryptor;
    let createKeyPair = ()=>{
        let privKey = grumpkin.getRandomFr(), pubKey = new GrumpkinAddress(grumpkin.mul(Grumpkin.one, privKey));
        return {
            privKey,
            pubKey
        };
    };
    beforeAll(async ()=>{
        let wasm = await BarretenbergWasm.new();
        grumpkin = new Grumpkin(wasm);
        let pool = await WorkerPool.new(wasm, 4);
        noteDecryptor = new PooledNoteDecryptor(pool), singleNoteDecryptor = new SingleNoteDecryptor(wasm);
    }), it('batch decrypt multiple viewing keys', async ()=>{
        let owner = createKeyPair(), eph = createKeyPair(), noteBufs = Array(10).fill(0).map(()=>randomBytes(72)), keys = noteBufs.map((noteBuf)=>ViewingKey.createFromEphPriv(noteBuf, owner.pubKey, eph.privKey, grumpkin)), keysBuf = Buffer.concat(keys.map((k)=>k.toBuffer()));
        {
            let decryptedNotes = await batchDecryptNotes(keysBuf, owner.privKey, singleNoteDecryptor, grumpkin);
            expect(decryptedNotes.length).toBe(noteBufs.length), decryptedNotes.forEach((decrypted, i)=>{
                expect(decrypted.noteBuf).toEqual(noteBufs[i]), expect(decrypted.ephPubKey).toEqual(eph.pubKey);
            });
        }
        {
            let decryptedNotes1 = await batchDecryptNotes(keysBuf, owner.privKey, noteDecryptor, grumpkin);
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
        ].fill(0).map(()=>randomBytes(72)), keys = noteBufs.map((noteBuf)=>ViewingKey.createFromEphPriv(noteBuf, owner.pubKey, eph.privKey, grumpkin));
        keys.splice(2, 1, ViewingKey.random()), keys.push(ViewingKey.random());
        let keysBuf = Buffer.concat(keys.map((k)=>k.toBuffer())), decryptedNotes = await batchDecryptNotes(keysBuf, owner.privKey, noteDecryptor, grumpkin);
        expect(decryptedNotes.length).toBe(noteBufs.length), decryptedNotes.forEach((decrypted, i)=>{
            2 === i ? expect(decrypted).toBe(void 0) : (expect(decrypted.noteBuf).toEqual(noteBufs[i]), expect(decrypted.ephPubKey).toEqual(eph.pubKey));
        });
    });
});
