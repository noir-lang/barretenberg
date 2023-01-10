"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "recoverTreeNotes", {
    enumerable: !0,
    get: ()=>recoverTreeNotes
});
const _address = require("../address"), _log = require("../log"), _grumpkin = require("../ecc/grumpkin"), _treeNote = require("./tree_note"), debug = (0, _log.createDebugLogger)('recover_tree_notes'), recoverTreeNotes = (decryptedNotes, inputNullifiers, noteCommitments, privateKey, grumpkin, noteAlgorithms)=>{
    let ownerPubKey = new _address.GrumpkinAddress(grumpkin.mul(_grumpkin.Grumpkin.one, privateKey));
    return decryptedNotes.map((decrypted, i)=>{
        if (!decrypted) {
            debug(`index ${i}: no decrypted tree note.`);
            return;
        }
        let noteCommitment = noteCommitments[i], inputNullifier = inputNullifiers[i], note = _treeNote.TreeNote.recover(decrypted, inputNullifier, ownerPubKey);
        debug({
            note
        });
        let commitment = noteAlgorithms.valueNoteCommitment(note);
        if (commitment.equals(noteCommitment)) return debug(`index ${i}: tree commitment ${noteCommitment.toString('hex')} matches note version 1.`), note;
        debug(`index ${i}: tree commitment ${noteCommitment.toString('hex')} != encrypted note commitment ${commitment.toString('hex')}.`);
    });
};
