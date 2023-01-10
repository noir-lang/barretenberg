import { GrumpkinAddress } from '../address';
import { ViewingKey } from '../viewing_key';
import { deriveNoteSecret } from './derive_note_secret';
export const batchDecryptNotes = async (viewingKeys, privateKey, noteDecryptor, grumpkin)=>{
    let dataBuf = await noteDecryptor.batchDecryptNotes(viewingKeys, privateKey), notes = [];
    for(let i = 0, startIndex = 0; startIndex < dataBuf.length; ++i, startIndex += 73){
        let noteBuf = dataBuf.slice(startIndex, startIndex + 73);
        if (noteBuf.length > 0 && noteBuf[0]) {
            let ephPubKey = new GrumpkinAddress(viewingKeys.slice((i + 1) * ViewingKey.SIZE - 64, (i + 1) * ViewingKey.SIZE)), noteSecret = deriveNoteSecret(ephPubKey, privateKey, grumpkin);
            notes[i] = {
                noteBuf: noteBuf.slice(1),
                ephPubKey,
                noteSecret
            };
        }
    }
    return notes;
};
