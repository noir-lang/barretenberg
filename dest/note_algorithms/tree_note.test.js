"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _crypto = require("crypto"), _address = require("../address"), _grumpkin = require("../ecc/grumpkin"), _noteAlgorithms = require("../note_algorithms"), _wasm = require("../wasm"), _serialize = require("../serialize"), _noteDecryptor = require("./note_decryptor");
describe('tree_note', ()=>{
    let grumpkin, noteAlgos, noteDecryptor;
    let createKeyPair = ()=>{
        let privKey = grumpkin.getRandomFr(), pubKey = new _address.GrumpkinAddress(grumpkin.mul(_grumpkin.Grumpkin.one, privKey));
        return {
            privKey,
            pubKey
        };
    };
    beforeAll(async ()=>{
        let wasm = await _wasm.BarretenbergWasm.new();
        grumpkin = new _grumpkin.Grumpkin(wasm), noteAlgos = new _noteAlgorithms.NoteAlgorithms(wasm), noteDecryptor = new _noteDecryptor.SingleNoteDecryptor(wasm);
    }), it('should convert to and from buffer', ()=>{
        let note = new _noteAlgorithms.TreeNote(_address.GrumpkinAddress.random(), BigInt(123), 456, !0, (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32));
        expect(_noteAlgorithms.TreeNote.fromBuffer(note.toBuffer())).toEqual(note);
    }), it('should correctly batch decrypt notes', async ()=>{
        let receiver = createKeyPair(), encryptedNotes = [], inputNullifiers = [], notes = [], noteCommitments = [];
        for(let i = 0; i < 8; ++i){
            let ephPrivKey = grumpkin.getRandomFr(), inputNullifier = (0, _serialize.numToUInt32BE)(i, 32);
            inputNullifiers.push(inputNullifier);
            let note = _noteAlgorithms.TreeNote.createFromEphPriv(receiver.pubKey, BigInt(100 + i), 0, i % 2 > 0, inputNullifier, ephPrivKey, grumpkin);
            notes.push(note), encryptedNotes.push(note.createViewingKey(ephPrivKey, grumpkin)), noteCommitments.push(noteAlgos.valueNoteCommitment(note));
        }
        let keyBuf = Buffer.concat(encryptedNotes.map((vk)=>vk.toBuffer())), decryptedNotes = await (0, _noteAlgorithms.batchDecryptNotes)(keyBuf, receiver.privKey, noteDecryptor, grumpkin), recovered = (0, _noteAlgorithms.recoverTreeNotes)(decryptedNotes, inputNullifiers, noteCommitments, receiver.privKey, grumpkin, noteAlgos);
        for(let i1 = 0; i1 < 8; ++i1)expect(recovered[i1]).toEqual(notes[i1]);
    }), it('should correctly batch decrypt notes and identify unowned notes', async ()=>{
        let receiver = createKeyPair(), stranger = createKeyPair(), encryptedNotes = [], inputNullifiers = [], notes = [], noteCommitments = [];
        for(let i = 0; i < 8; ++i){
            let owner = i % 2 ? stranger : receiver, ephPrivKey = grumpkin.getRandomFr(), inputNullifier = (0, _serialize.numToUInt32BE)(i, 32);
            inputNullifiers.push(inputNullifier);
            let note = _noteAlgorithms.TreeNote.createFromEphPriv(owner.pubKey, BigInt(200), 0, i % 2 > 0, inputNullifier, ephPrivKey, grumpkin);
            notes.push(note), encryptedNotes.push(note.createViewingKey(ephPrivKey, grumpkin)), noteCommitments.push(noteAlgos.valueNoteCommitment(note));
        }
        let keyBuf = Buffer.concat(encryptedNotes.map((vk)=>vk.toBuffer())), decryptedNotes = await (0, _noteAlgorithms.batchDecryptNotes)(keyBuf, receiver.privKey, noteDecryptor, grumpkin), recovered = (0, _noteAlgorithms.recoverTreeNotes)(decryptedNotes, inputNullifiers, noteCommitments, receiver.privKey, grumpkin, noteAlgos);
        for(let i1 = 0; i1 < 8; ++i1){
            let note1 = recovered[i1];
            i1 % 2 ? expect(note1).toBe(void 0) : expect(note1).toEqual(notes[i1]);
        }
    }), it('should correctly encrypt and decrypt note using new secret derivation method', async ()=>{
        let receiver = createKeyPair(), encryptedNotes = [], inputNullifiers = [], notes = [], noteCommitments = [];
        for(let i = 0; i < 8; ++i){
            let ephPrivKey = grumpkin.getRandomFr(), inputNullifier = (0, _serialize.numToUInt32BE)(i, 32);
            inputNullifiers.push(inputNullifier);
            let note = _noteAlgorithms.TreeNote.createFromEphPriv(receiver.pubKey, BigInt(200), 0, i % 2 > 0, inputNullifier, ephPrivKey, grumpkin);
            notes.push(note), encryptedNotes.push(note.createViewingKey(ephPrivKey, grumpkin)), noteCommitments.push(noteAlgos.valueNoteCommitment(note));
        }
        let keyBuf = Buffer.concat(encryptedNotes.map((vk)=>vk.toBuffer())), decryptedNotes = await (0, _noteAlgorithms.batchDecryptNotes)(keyBuf, receiver.privKey, noteDecryptor, grumpkin), recovered = (0, _noteAlgorithms.recoverTreeNotes)(decryptedNotes, inputNullifiers, noteCommitments, receiver.privKey, grumpkin, noteAlgos);
        for(let i1 = 0; i1 < 8; ++i1)expect(recovered[i1]).toEqual(notes[i1]);
    }), it('should not decrypt notes with a wrong private key', async ()=>{
        let receiver = createKeyPair(), encryptedNotes = [], inputNullifiers = [], notes = [], noteCommitments = [];
        for(let i = 0; i < 4; ++i){
            let ephPrivKey = grumpkin.getRandomFr(), inputNullifier = (0, _serialize.numToUInt32BE)(i, 32);
            inputNullifiers.push(inputNullifier);
            let note = _noteAlgorithms.TreeNote.createFromEphPriv(receiver.pubKey, BigInt(100 + i), 0, i % 2 > 0, inputNullifier, ephPrivKey, grumpkin);
            notes.push(note), encryptedNotes.push(note.createViewingKey(ephPrivKey, grumpkin)), noteCommitments.push(noteAlgos.valueNoteCommitment(note));
        }
        let keyBuf = Buffer.concat(encryptedNotes.map((vk)=>vk.toBuffer())), decryptedNotes = await (0, _noteAlgorithms.batchDecryptNotes)(keyBuf, receiver.privKey, noteDecryptor, grumpkin), fakePrivKey = (0, _crypto.randomBytes)(32), recovered = (0, _noteAlgorithms.recoverTreeNotes)(decryptedNotes, inputNullifiers, noteCommitments, fakePrivKey, grumpkin, noteAlgos);
        for(let i1 = 0; i1 < 4; ++i1)expect(recovered[i1]).toBe(void 0);
    });
});
