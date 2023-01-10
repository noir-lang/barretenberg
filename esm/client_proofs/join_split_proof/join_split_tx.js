import { AliasHash } from '../../account_id';
import { EthAddress, GrumpkinAddress } from '../../address';
import { toBigIntBE, toBufferBE } from '../../bigint_buffer';
import { HashPath } from '../../merkle_tree';
import { ClaimNoteTxData, TreeNote } from '../../note_algorithms';
import { numToUInt32BE } from '../../serialize';
export class JoinSplitTx {
    toBuffer() {
        return Buffer.concat([
            numToUInt32BE(this.proofId),
            toBufferBE(this.publicValue, 32),
            this.publicOwner.toBuffer32(),
            numToUInt32BE(this.publicAssetId),
            numToUInt32BE(this.numInputNotes),
            numToUInt32BE(this.inputNoteIndices[0]),
            numToUInt32BE(this.inputNoteIndices[1]),
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
            numToUInt32BE(this.accountIndex),
            this.accountPath.toBuffer(),
            this.spendingPublicKey.toBuffer(),
            this.backwardLink,
            numToUInt32BE(this.allowChain)
        ]);
    }
    static fromBuffer(buf) {
        let dataStart = 0, proofId = buf.readUInt32BE(dataStart);
        dataStart += 4;
        let publicValue = toBigIntBE(buf.slice(dataStart, dataStart + 32));
        dataStart += 32;
        let publicOwner = new EthAddress(buf.slice(dataStart, dataStart + 32));
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
        let inputNotePath0 = HashPath.deserialize(buf, dataStart);
        dataStart += inputNotePath0.adv;
        let inputNotePath1 = HashPath.deserialize(buf, dataStart);
        dataStart += inputNotePath1.adv;
        let inputNote0 = TreeNote.fromBuffer(buf.slice(dataStart));
        dataStart += TreeNote.SIZE;
        let inputNote1 = TreeNote.fromBuffer(buf.slice(dataStart));
        dataStart += TreeNote.SIZE;
        let outputNote0 = TreeNote.fromBuffer(buf.slice(dataStart));
        dataStart += TreeNote.SIZE;
        let outputNote1 = TreeNote.fromBuffer(buf.slice(dataStart));
        dataStart += TreeNote.SIZE;
        let claimNote = ClaimNoteTxData.fromBuffer(buf.slice(dataStart));
        dataStart += ClaimNoteTxData.SIZE;
        let accountPrivateKey = buf.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let aliasHash = new AliasHash(buf.slice(dataStart + 4, dataStart + 32));
        dataStart += 32;
        let accountRequired = !!buf[dataStart];
        dataStart += 1;
        let accountIndex = buf.readUInt32BE(dataStart);
        dataStart += 4;
        let accountPath = HashPath.deserialize(buf, dataStart);
        dataStart += accountPath.adv;
        let spendingPublicKey = new GrumpkinAddress(buf.slice(dataStart, dataStart + 64));
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
