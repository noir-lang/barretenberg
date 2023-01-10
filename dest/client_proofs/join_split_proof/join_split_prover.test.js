"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _debug = _interopRequireDefault(require("debug")), _events = require("events"), _levelup = _interopRequireDefault(require("levelup")), _memdown = _interopRequireDefault(require("memdown")), _accountId = require("../../account_id"), _address = require("../../address"), _crs = require("../../crs"), _crypto = require("../../crypto"), _ecc = require("../../ecc"), _fft = require("../../fft"), _merkleTree = require("../../merkle_tree"), _noteAlgorithms = require("../../note_algorithms"), _pippenger = require("../../pippenger"), _serialize = require("../../serialize"), _wasm = require("../../wasm"), _workerPool = require("../../wasm/worker_pool"), _proofData = require("../proof_data"), _prover = require("../prover"), _joinSplitProver = require("./join_split_prover"), _joinSplitTx = require("./join_split_tx"), _joinSplitVerifier = require("./join_split_verifier");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const debug = (0, _debug.default)('bb:join_split_proof_test');
jest.setTimeout(120000), describe('join_split_proof', ()=>{
    let barretenberg, pool, joinSplitVerifier, sha256, blake2s, pedersen, schnorr, crs, pippenger, grumpkin, noteAlgos, pubKey;
    let privateKey = Buffer.from([
        0x0b,
        0x9b,
        0x3a,
        0xde,
        0xe6,
        0xb3,
        0xd8,
        0x1b,
        0x28,
        0xa0,
        0x88,
        0x6b,
        0x2a,
        0x84,
        0x15,
        0xc7,
        0xda,
        0x31,
        0x29,
        0x1a,
        0x5e,
        0x96,
        0xbb,
        0x7a,
        0x56,
        0x63,
        0x9e,
        0x17,
        0x7d,
        0x30,
        0x1b,
        0xeb
    ]), createEphemeralPrivKey = (grumpkin)=>grumpkin.getRandomFr();
    beforeAll(async ()=>{
        _events.EventEmitter.defaultMaxListeners = 32, await (crs = new _crs.Crs(65536)).download(), await (pool = new _workerPool.WorkerPool()).init((barretenberg = await _wasm.BarretenbergWasm.new()).module, Math.min(navigator.hardwareConcurrency, 8)), await (pippenger = new _pippenger.PooledPippenger(pool)).init(crs.getData()), sha256 = new _crypto.Sha256(barretenberg), blake2s = new _crypto.Blake2s(barretenberg), pedersen = new _crypto.SinglePedersen(barretenberg), schnorr = new _crypto.Schnorr(barretenberg), grumpkin = new _ecc.Grumpkin(barretenberg), noteAlgos = new _noteAlgorithms.NoteAlgorithms(barretenberg), joinSplitVerifier = new _joinSplitVerifier.JoinSplitVerifier(), pubKey = new _address.GrumpkinAddress(grumpkin.mul(_ecc.Grumpkin.one, privateKey));
    }), afterAll(async ()=>{
        await pool.destroy();
    });
    let createAndCheckProof = async (joinSplitProver)=>{
        let publicValue = BigInt(0), publicOwner = _address.EthAddress.ZERO, txFee = BigInt(20), inputNote1EphKey = createEphemeralPrivKey(grumpkin), inputNote2EphKey = createEphemeralPrivKey(grumpkin), outputNote1EphKey = createEphemeralPrivKey(grumpkin), outputNote2EphKey = createEphemeralPrivKey(grumpkin), inputNoteNullifier1 = (0, _serialize.numToUInt32BE)(1, 32), inputNoteNullifier2 = (0, _serialize.numToUInt32BE)(2, 32), inputNote1 = _noteAlgorithms.TreeNote.createFromEphPriv(pubKey, BigInt(100), 1, !1, inputNoteNullifier1, inputNote1EphKey, grumpkin), inputNote2 = _noteAlgorithms.TreeNote.createFromEphPriv(pubKey, BigInt(50), 1, !1, inputNoteNullifier2, inputNote2EphKey, grumpkin), inputNote1Enc = noteAlgos.valueNoteCommitment(inputNote1), inputNote2Enc = noteAlgos.valueNoteCommitment(inputNote2), expectedNullifier1 = noteAlgos.valueNoteNullifier(inputNote1Enc, privateKey), expectedNullifier2 = noteAlgos.valueNoteNullifier(inputNote2Enc, privateKey), outputNote1 = _noteAlgorithms.TreeNote.createFromEphPriv(pubKey, BigInt(80), 1, !0, expectedNullifier1, outputNote1EphKey, grumpkin), outputNote2 = _noteAlgorithms.TreeNote.createFromEphPriv(pubKey, BigInt(50), 1, !1, expectedNullifier2, outputNote2EphKey, grumpkin), tree = new _merkleTree.MerkleTree((0, _levelup.default)((0, _memdown.default)()), pedersen, 'data', 32);
        await tree.updateElement(0, inputNote1Enc), await tree.updateElement(1, inputNote2Enc);
        let inputNote1Path = await tree.getHashPath(0), inputNote2Path = await tree.getHashPath(1), accountNotePath = await tree.getHashPath(2), aliasHash = _accountId.AliasHash.fromAlias('user_zero', blake2s), tx = new _joinSplitTx.JoinSplitTx(_proofData.ProofId.SEND, publicValue, publicOwner, 1, 2, [
            0,
            1
        ], tree.getRoot(), [
            inputNote1Path,
            inputNote2Path
        ], [
            inputNote1,
            inputNote2
        ], [
            outputNote1,
            outputNote2
        ], _noteAlgorithms.ClaimNoteTxData.EMPTY, privateKey, aliasHash, !1, 2, accountNotePath, pubKey, Buffer.alloc(32), 0), signingData = await joinSplitProver.computeSigningData(tx), signature = schnorr.constructSignature(signingData, privateKey);
        debug('creating proof...');
        let start = new Date().getTime(), proof = await joinSplitProver.createProof(tx, signature);
        if (debug(`created proof: ${new Date().getTime() - start}ms`), debug(`proof size: ${proof.length}`), !joinSplitProver.mock) {
            let verified = await joinSplitVerifier.verifyProof(proof);
            expect(verified).toBe(!0);
        }
        let proofData = new _proofData.ProofData(proof), joinSplitProofData = new _proofData.JoinSplitProofData(proofData), noteCommitment1 = noteAlgos.valueNoteCommitment(outputNote1), noteCommitment2 = noteAlgos.valueNoteCommitment(outputNote2);
        expect(proofData.proofId).toEqual(_proofData.ProofId.SEND), expect(proofData.noteCommitment1).toEqual(noteCommitment1), expect(proofData.noteCommitment2).toEqual(noteCommitment2), expect(proofData.nullifier1).toEqual(expectedNullifier1), expect(proofData.nullifier2).toEqual(expectedNullifier2), expect(joinSplitProofData.publicValue).toEqual(publicValue), expect(joinSplitProofData.publicOwner).toEqual(publicOwner), expect(joinSplitProofData.publicAssetId).toEqual(0), expect(proofData.noteTreeRoot).toEqual(tree.getRoot()), expect(joinSplitProofData.txFee).toEqual(txFee), expect(joinSplitProofData.txFeeAssetId).toEqual(1), expect(proofData.bridgeId).toEqual(Buffer.alloc(32)), expect(proofData.defiDepositValue).toEqual(Buffer.alloc(32)), expect(proofData.defiRoot).toEqual(Buffer.alloc(32)), expect(proofData.backwardLink).toEqual(Buffer.alloc(32)), expect(proofData.allowChain).toEqual(Buffer.alloc(32));
    };
    describe('join_split_mock_proof_generation', ()=>{
        let fft, joinSplitProver;
        beforeAll(async ()=>{
            await (fft = new _fft.SingleFft(pool.workers[0])).init(512);
            let prover = new _prover.UnrolledProver(pool.workers[0], pippenger, fft);
            joinSplitProver = new _joinSplitProver.JoinSplitProver(prover, !0), debug('creating keys...');
            let start = new Date().getTime();
            await joinSplitProver.computeKey(), await joinSplitVerifier.computeKey(pippenger.pool[0], crs.getG2Data()), debug(`created circuit keys: ${new Date().getTime() - start}ms`), debug(`vk hash: ${sha256.hash(await joinSplitVerifier.getKey()).toString('hex')}`);
        }), afterAll(async ()=>{
            await fft.destroy();
        }), it('should construct mock join split proof', async ()=>{
            await createAndCheckProof(joinSplitProver);
        });
    }), describe('join_split_proof_generation', ()=>{
        let fft, joinSplitProver;
        beforeAll(async ()=>{
            await (fft = new _fft.PooledFft(pool)).init(_joinSplitProver.JoinSplitProver.getCircuitSize());
            let prover = new _prover.UnrolledProver(pool.workers[0], pippenger, fft);
            joinSplitProver = new _joinSplitProver.JoinSplitProver(prover, !1), debug('creating keys...');
            let start = new Date().getTime();
            await joinSplitProver.computeKey(), await joinSplitVerifier.computeKey(pippenger.pool[0], crs.getG2Data()), debug(`created circuit keys: ${new Date().getTime() - start}ms`), debug(`vk hash: ${sha256.hash(await joinSplitVerifier.getKey()).toString('hex')}`);
        }), afterAll(async ()=>{
            await fft.destroy();
        }), it('should get key data', async ()=>{
            let provingKey = await joinSplitProver.getKey();
            expect(provingKey.length).toBeGreaterThan(0);
            let verificationKey = await joinSplitVerifier.getKey();
            expect(verificationKey.length).toBeGreaterThan(0);
        }), it('should construct join split proof', async ()=>{
            await createAndCheckProof(joinSplitProver);
        });
    });
});
