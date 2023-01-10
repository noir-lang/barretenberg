"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _treeClaimNote = require("./tree_claim_note");
describe('tree_claim_note', ()=>{
    it('convert tree claim note to and from buffer', ()=>{
        let note = _treeClaimNote.TreeClaimNote.random(), buf = note.toBuffer();
        expect(buf.length).toBe(_treeClaimNote.TreeClaimNote.LENGTH);
        let recovered = _treeClaimNote.TreeClaimNote.fromBuffer(buf);
        expect(recovered).toEqual(note);
    });
});
