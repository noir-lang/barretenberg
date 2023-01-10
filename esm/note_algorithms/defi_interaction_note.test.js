import { RollupProofData } from '../rollup_proof';
import { WorldStateConstants } from '../world_state';
import { DefiInteractionNote, packInteractionNotes } from './defi_interaction_note';
let numberOfBridgeCalls = RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK;
describe('defi interaction note', ()=>{
    it('convert interaction note to and form buffer', ()=>{
        let note = DefiInteractionNote.random(), buf = note.toBuffer();
        expect(buf.length).toBe(DefiInteractionNote.deserialize(buf, 0).adv);
        let recovered = DefiInteractionNote.fromBuffer(buf);
        expect(recovered).toEqual(note);
    }), it('hash an array of empty interaction note', ()=>{
        let notes = [
            ...Array(numberOfBridgeCalls)
        ].map(()=>DefiInteractionNote.EMPTY), hash = packInteractionNotes(notes);
        expect(hash).toEqual(WorldStateConstants.INITIAL_INTERACTION_HASH);
    });
});
