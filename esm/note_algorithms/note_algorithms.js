import { toBigIntBE, toBufferBE } from '../bigint_buffer';
export class NoteAlgorithms {
    valueNoteNullifier(noteCommitment, accountPrivateKey, real = !0) {
        return this.wasm.transferToHeap(noteCommitment, 0), this.wasm.transferToHeap(accountPrivateKey, 64), this.wasm.call('notes__value_note_nullifier', 0, 64, real, 0), Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    valueNoteNullifierBigInt(noteCommitment, accountPrivateKey, real = !0) {
        return toBigIntBE(this.valueNoteNullifier(noteCommitment, accountPrivateKey, real));
    }
    valueNoteCommitment(note) {
        let noteBuf = note.toBuffer(), mem = this.wasm.call('bbmalloc', noteBuf.length);
        return this.wasm.transferToHeap(noteBuf, mem), this.wasm.call('notes__value_note_commitment', mem, 0), this.wasm.call('bbfree', mem), Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    valueNotePartialCommitment(noteSecret, owner, accountRequired) {
        return this.wasm.transferToHeap(noteSecret, 0), this.wasm.transferToHeap(owner.toBuffer(), 32), this.wasm.transferToHeap(Buffer.alloc(32), 96), this.wasm.call('notes__value_note_partial_commitment', 0, 32, 96, accountRequired, 0), Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    claimNotePartialCommitment(note) {
        let noteBuf = note.toBuffer(), mem = this.wasm.call('bbmalloc', noteBuf.length);
        return this.wasm.transferToHeap(noteBuf, mem), this.wasm.call('notes__claim_note_partial_commitment', mem, 0), this.wasm.call('bbfree', mem), Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    claimNoteCompletePartialCommitment(partialNote, interactionNonce, fee) {
        return this.wasm.transferToHeap(partialNote, 0), this.wasm.transferToHeap(toBufferBE(fee, 32), 32), this.wasm.call('notes__claim_note_complete_partial_commitment', 0, interactionNonce, 32, 0), Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    claimNoteCommitment(note) {
        let partial = this.claimNotePartialCommitment(note);
        return this.claimNoteCompletePartialCommitment(partial, note.defiInteractionNonce, note.fee);
    }
    claimNoteNullifier(noteCommitment) {
        return this.wasm.transferToHeap(noteCommitment, 0), this.wasm.call('notes__claim_note_nullifier', 0, 0), Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    defiInteractionNoteCommitment(note) {
        let noteBuf = note.toBuffer(), mem = this.wasm.call('bbmalloc', noteBuf.length);
        return this.wasm.transferToHeap(noteBuf, mem), this.wasm.call('notes__defi_interaction_note_commitment', mem, 0), this.wasm.call('bbfree', mem), Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    accountNoteCommitment(aliasHash, accountPublicKey, spendingPublicKey) {
        return this.wasm.transferToHeap(aliasHash.toBuffer32(), 0), this.wasm.transferToHeap(accountPublicKey.toBuffer(), 32), this.wasm.transferToHeap(spendingPublicKey, 64), this.wasm.call('notes__account_note_commitment', 0, 32, 64, 0), Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    accountAliasHashNullifier(aliasHash) {
        return this.wasm.transferToHeap(aliasHash.toBuffer32(), 0), this.wasm.call('notes__compute_account_alias_hash_nullifier', 0, 0), Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    accountPublicKeyNullifier(accountPublicKey) {
        return this.wasm.transferToHeap(accountPublicKey.toBuffer(), 0), this.wasm.call('notes__compute_account_public_key_nullifier', 0, 0), Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    constructor(wasm){
        this.wasm = wasm;
    }
}
