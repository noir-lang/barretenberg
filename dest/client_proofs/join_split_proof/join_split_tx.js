"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "JoinSplitTx", {
    enumerable: !0,
    get: ()=>JoinSplitTx
});
const _accountId = require("../../account_id"), _address = require("../../address"), _bigintBuffer = require("../../bigint_buffer"), _merkleTree = require("../../merkle_tree"), _noteAlgorithms = require("../../note_algorithms"), _serialize = require("../../serialize");
class JoinSplitTx {
    toBuffer() {
        return Buffer.concat([
            (0, _serialize.numToUInt32BE)(this.proofId),
            (0, _bigintBuffer.toBufferBE)(this.publicValue, 32),
            this.publicOwner.toBuffer32(),
            (0, _serialize.numToUInt32BE)(this.publicAssetId),
            (0, _serialize.numToUInt32BE)(this.numInputNotes),
            (0, _serialize.numToUInt32BE)(this.inputNoteIndices[0]),
            (0, _serialize.numToUInt32BE)(this.inputNoteIndices[1]),
            this.merkleRoot,
            this.inputNotePaths[0].toBuffer(),
            this.inputNotePaths[1].toBuffer(),
            this.inputNotes[0].toBuffer(),
            this.inputNotes[1].toBuffer(),
            this.outputNotes[0].toBuffer(),
            this.outputNotes[1].toBuffer(),
            this.claimNote.toBuffer(),
            this.accountPrivateKey,
            this.aliasHash.toBuffer32(),
            Buffer.from([
                +this.accountRequired
            ]),
            (0, _serialize.numToUInt32BE)(this.accountIndex),
            this.accountPath.toBuffer(),
            this.spendingPublicKey.toBuffer(),
            this.backwardLink,
            (0, _serialize.numToUInt32BE)(this.allowChain)
        ]);
    }
    static fromBuffer(buf) {
        let dataStart = 0, proofId = buf.readUInt32BE(dataStart);
        dataStart += 4;
        let publicValue = (0, _bigintBuffer.toBigIntBE)(buf.slice(dataStart, dataStart + 32));
        dataStart += 32;
        let publicOwner = new _address.EthAddress(buf.slice(dataStart, dataStart + 32));
        dataStart += 32;
        let publicAssetId = buf.readUInt32BE(dataStart);
        dataStart += 4;
        let numInputNotes = buf.readUInt32BE(dataStart);
        dataStart += 4;
        let inputNoteIndices = [
            buf.readUInt32BE(dataStart),
            buf.readUInt32BE(dataStart + 4)
        ];
        dataStart += 8;
        let merkleRoot = buf.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let inputNotePath0 = _merkleTree.HashPath.deserialize(buf, dataStart);
        dataStart += inputNotePath0.adv;
        let inputNotePath1 = _merkleTree.HashPath.deserialize(buf, dataStart);
        dataStart += inputNotePath1.adv;
        let inputNote0 = _noteAlgorithms.TreeNote.fromBuffer(buf.slice(dataStart));
        dataStart += _noteAlgorithms.TreeNote.SIZE;
        let inputNote1 = _noteAlgorithms.TreeNote.fromBuffer(buf.slice(dataStart));
        dataStart += _noteAlgorithms.TreeNote.SIZE;
        let outputNote0 = _noteAlgorithms.TreeNote.fromBuffer(buf.slice(dataStart));
        dataStart += _noteAlgorithms.TreeNote.SIZE;
        let outputNote1 = _noteAlgorithms.TreeNote.fromBuffer(buf.slice(dataStart));
        dataStart += _noteAlgorithms.TreeNote.SIZE;
        let claimNote = _noteAlgorithms.ClaimNoteTxData.fromBuffer(buf.slice(dataStart));
        dataStart += _noteAlgorithms.ClaimNoteTxData.SIZE;
        let accountPrivateKey = buf.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let aliasHash = new _accountId.AliasHash(buf.slice(dataStart + 4, dataStart + 32));
        dataStart += 32;
        let accountRequired = !!buf[dataStart];
        dataStart += 1;
        let accountIndex = buf.readUInt32BE(dataStart);
        dataStart += 4;
        let accountPath = _merkleTree.HashPath.deserialize(buf, dataStart);
        dataStart += accountPath.adv;
        let spendingPublicKey = new _address.GrumpkinAddress(buf.slice(dataStart, dataStart + 64));
        dataStart += 64;
        let backwardLink = buf.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let allowChain = buf.readUInt32BE(dataStart);
        return new JoinSplitTx(proofId, publicValue, publicOwner, publicAssetId, numInputNotes, inputNoteIndices, merkleRoot, [
            inputNotePath0.elem,
            inputNotePath1.elem
        ], [
            inputNote0,
            inputNote1
        ], [
            outputNote0,
            outputNote1
        ], claimNote, accountPrivateKey, aliasHash, accountRequired, accountIndex, accountPath.elem, spendingPublicKey, backwardLink, allowChain);
    }
    constructor(proofId, publicValue, publicOwner, publicAssetId, numInputNotes, inputNoteIndices, merkleRoot, inputNotePaths, inputNotes, outputNotes, claimNote, accountPrivateKey, aliasHash, accountRequired, accountIndex, accountPath, spendingPublicKey, backwardLink, allowChain){
        this.proofId = proofId, this.publicValue = publicValue, this.publicOwner = publicOwner, this.publicAssetId = publicAssetId, this.numInputNotes = numInputNotes, this.inputNoteIndices = inputNoteIndices, this.merkleRoot = merkleRoot, this.inputNotePaths = inputNotePaths, this.inputNotes = inputNotes, this.outputNotes = outputNotes, this.claimNote = claimNote, this.accountPrivateKey = accountPrivateKey, this.aliasHash = aliasHash, this.accountRequired = accountRequired, this.accountIndex = accountIndex, this.accountPath = accountPath, this.spendingPublicKey = spendingPublicKey, this.backwardLink = backwardLink, this.allowChain = allowChain;
    }
}
