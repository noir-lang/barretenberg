import { TreeClaimNote } from './tree_claim_note';
describe('tree_claim_note', ()=>{
    it('convert tree claim note to and from buffer', ()=>{
        let note = TreeClaimNote.random(), buf = note.toBuffer();
        expect(buf.length).toBe(TreeClaimNote.LENGTH);
        let recovered = TreeClaimNote.fromBuffer(buf);
        expect(recovered).toEqual(note);
    });
});
