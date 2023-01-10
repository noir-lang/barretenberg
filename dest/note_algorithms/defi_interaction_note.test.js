"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _rollupProof = require("../rollup_proof"), _worldState = require("../world_state"), _defiInteractionNote = require("./defi_interaction_note"), numberOfBridgeCalls = _rollupProof.RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK;
describe('defi interaction note', ()=>{
    it('convert interaction note to and form buffer', ()=>{
        let note = _defiInteractionNote.DefiInteractionNote.random(), buf = note.toBuffer();
        expect(buf.length).toBe(_defiInteractionNote.DefiInteractionNote.deserialize(buf, 0).adv);
        let recovered = _defiInteractionNote.DefiInteractionNote.fromBuffer(buf);
        expect(recovered).toEqual(note);
    }), it('hash an array of empty interaction note', ()=>{
        let notes = [
            ...Array(numberOfBridgeCalls)
        ].map(()=>_defiInteractionNote.DefiInteractionNote.EMPTY), hash = (0, _defiInteractionNote.packInteractionNotes)(notes);
        expect(hash).toEqual(_worldState.WorldStateConstants.INITIAL_INTERACTION_HASH);
    });
});
