"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "batchDecryptNotes", {
    enumerable: !0,
    get: ()=>batchDecryptNotes
});
const _address = require("../address"), _viewingKey = require("../viewing_key"), _deriveNoteSecret = require("./derive_note_secret"), batchDecryptNotes = async (viewingKeys, privateKey, noteDecryptor, grumpkin)=>{
    let dataBuf = await noteDecryptor.batchDecryptNotes(viewingKeys, privateKey), notes = [];
    for(let i = 0, startIndex = 0; startIndex < dataBuf.length; ++i, startIndex += 73){
        let noteBuf = dataBuf.slice(startIndex, startIndex + 73);
        if (noteBuf.length > 0 && noteBuf[0]) {
            let ephPubKey = new _address.GrumpkinAddress(viewingKeys.slice((i + 1) * _viewingKey.ViewingKey.SIZE - 64, (i + 1) * _viewingKey.ViewingKey.SIZE)), noteSecret = (0, _deriveNoteSecret.deriveNoteSecret)(ephPubKey, privateKey, grumpkin);
            notes[i] = {
                noteBuf: noteBuf.slice(1),
                ephPubKey,
                noteSecret
            };
        }
    }
    return notes;
};
