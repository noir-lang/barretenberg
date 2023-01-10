import { GrumpkinAddress } from '../address';
import { createDebugLogger } from '../log';
import { Grumpkin } from '../ecc/grumpkin';
import { TreeNote } from './tree_note';
let debug = createDebugLogger('recover_tree_notes');
export const recoverTreeNotes = (decryptedNotes, inputNullifiers, noteCommitments, privateKey, grumpkin, noteAlgorithms)=>{
    let ownerPubKey = new GrumpkinAddress(grumpkin.mul(Grumpkin.one, privateKey));
    return decryptedNotes.map((decrypted, i)=>{
        if (!decrypted) {
            debug(`index ${i}: no decrypted tree note.`);
            return;
        }
        let noteCommitment = noteCommitments[i], inputNullifier = inputNullifiers[i], note = TreeNote.recover(decrypted, inputNullifier, ownerPubKey);
        debug({
            note
        });
        let commitment = noteAlgorithms.valueNoteCommitment(note);
        if (commitment.equals(noteCommitment)) return debug(`index ${i}: tree commitment ${noteCommitment.toString('hex')} matches note version 1.`), note;
        debug(`index ${i}: tree commitment ${noteCommitment.toString('hex')} != encrypted note commitment ${commitment.toString('hex')}.`);
    });
};
