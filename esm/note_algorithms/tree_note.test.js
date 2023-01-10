import { randomBytes } from 'crypto';
import { GrumpkinAddress } from '../address';
import { Grumpkin } from '../ecc/grumpkin';
import { batchDecryptNotes, NoteAlgorithms, recoverTreeNotes, TreeNote } from '../note_algorithms';
import { BarretenbergWasm } from '../wasm';
import { numToUInt32BE } from '../serialize';
import { SingleNoteDecryptor } from './note_decryptor';
describe('tree_note', ()=>{
    let grumpkin, noteAlgos, noteDecryptor;
    let createKeyPair = ()=>{
        let privKey = grumpkin.getRandomFr(), pubKey = new GrumpkinAddress(grumpkin.mul(Grumpkin.one, privKey));
        return {
            privKey,
            pubKey
        };
    };
    beforeAll(async ()=>{
        let wasm = await BarretenbergWasm.new();
        grumpkin = new Grumpkin(wasm), noteAlgos = new NoteAlgorithms(wasm), noteDecryptor = new SingleNoteDecryptor(wasm);
    }), it('should convert to and from buffer', ()=>{
        let note = new TreeNote(GrumpkinAddress.random(), BigInt(123), 456, !0, randomBytes(32), randomBytes(32), randomBytes(32));
        expect(TreeNote.fromBuffer(note.toBuffer())).toEqual(note);
    }), it('should correctly batch decrypt notes', async ()=>{
        let receiver = createKeyPair(), encryptedNotes = [], inputNullifiers = [], notes = [], noteCommitments = [];
        for(let i = 0; i < 8; ++i){
            let ephPrivKey = grumpkin.getRandomFr(), inputNullifier = numToUInt32BE(i, 32);
            inputNullifiers.push(inputNullifier);
            let note = TreeNote.createFromEphPriv(receiver.pubKey, BigInt(100 + i), 0, i % 2 > 0, inputNullifier, ephPrivKey, grumpkin);
            notes.push(note), encryptedNotes.push(note.createViewingKey(ephPrivKey, grumpkin)), noteCommitments.push(noteAlgos.valueNoteCommitment(note));
        }
        let keyBuf = Buffer.concat(encryptedNotes.map((vk)=>vk.toBuffer())), decryptedNotes = await batchDecryptNotes(keyBuf, receiver.privKey, noteDecryptor, grumpkin), recovered = recoverTreeNotes(decryptedNotes, inputNullifiers, noteCommitments, receiver.privKey, grumpkin, noteAlgos);
        for(let i1 = 0; i1 < 8; ++i1)expect(recovered[i1]).toEqual(notes[i1]);
    }), it('should correctly batch decrypt notes and identify unowned notes', async ()=>{
        let receiver = createKeyPair(), stranger = createKeyPair(), encryptedNotes = [], inputNullifiers = [], notes = [], noteCommitments = [];
        for(let i = 0; i < 8; ++i){
            let owner = i % 2 ? stranger : receiver, ephPrivKey = grumpkin.getRandomFr(), inputNullifier = numToUInt32BE(i, 32);
            inputNullifiers.push(inputNullifier);
            let note = TreeNote.createFromEphPriv(owner.pubKey, BigInt(200), 0, i % 2 > 0, inputNullifier, ephPrivKey, grumpkin);
            notes.push(note), encryptedNotes.push(note.createViewingKey(ephPrivKey, grumpkin)), noteCommitments.push(noteAlgos.valueNoteCommitment(note));
        }
        let keyBuf = Buffer.concat(encryptedNotes.map((vk)=>vk.toBuffer())), decryptedNotes = await batchDecryptNotes(keyBuf, receiver.privKey, noteDecryptor, grumpkin), recovered = recoverTreeNotes(decryptedNotes, inputNullifiers, noteCommitments, receiver.privKey, grumpkin, noteAlgos);
        for(let i1 = 0; i1 < 8; ++i1){
            let note1 = recovered[i1];
            i1 % 2 ? expect(note1).toBe(void 0) : expect(note1).toEqual(notes[i1]);
        }
    }), it('should correctly encrypt and decrypt note using new secret derivation method', async ()=>{
        let receiver = createKeyPair(), encryptedNotes = [], inputNullifiers = [], notes = [], noteCommitments = [];
        for(let i = 0; i < 8; ++i){
            let ephPrivKey = grumpkin.getRandomFr(), inputNullifier = numToUInt32BE(i, 32);
            inputNullifiers.push(inputNullifier);
            let note = TreeNote.createFromEphPriv(receiver.pubKey, BigInt(200), 0, i % 2 > 0, inputNullifier, ephPrivKey, grumpkin);
            notes.push(note), encryptedNotes.push(note.createViewingKey(ephPrivKey, grumpkin)), noteCommitments.push(noteAlgos.valueNoteCommitment(note));
        }
        let keyBuf = Buffer.concat(encryptedNotes.map((vk)=>vk.toBuffer())), decryptedNotes = await batchDecryptNotes(keyBuf, receiver.privKey, noteDecryptor, grumpkin), recovered = recoverTreeNotes(decryptedNotes, inputNullifiers, noteCommitments, receiver.privKey, grumpkin, noteAlgos);
        for(let i1 = 0; i1 < 8; ++i1)expect(recovered[i1]).toEqual(notes[i1]);
    }), it('should not decrypt notes with a wrong private key', async ()=>{
        let receiver = createKeyPair(), encryptedNotes = [], inputNullifiers = [], notes = [], noteCommitments = [];
        for(let i = 0; i < 4; ++i){
            let ephPrivKey = grumpkin.getRandomFr(), inputNullifier = numToUInt32BE(i, 32);
            inputNullifiers.push(inputNullifier);
            let note = TreeNote.createFromEphPriv(receiver.pubKey, BigInt(100 + i), 0, i % 2 > 0, inputNullifier, ephPrivKey, grumpkin);
            notes.push(note), encryptedNotes.push(note.createViewingKey(ephPrivKey, grumpkin)), noteCommitments.push(noteAlgos.valueNoteCommitment(note));
        }
        let keyBuf = Buffer.concat(encryptedNotes.map((vk)=>vk.toBuffer())), decryptedNotes = await batchDecryptNotes(keyBuf, receiver.privKey, noteDecryptor, grumpkin), fakePrivKey = randomBytes(32), recovered = recoverTreeNotes(decryptedNotes, inputNullifiers, noteCommitments, fakePrivKey, grumpkin, noteAlgos);
        for(let i1 = 0; i1 < 4; ++i1)expect(recovered[i1]).toBe(void 0);
    });
});
