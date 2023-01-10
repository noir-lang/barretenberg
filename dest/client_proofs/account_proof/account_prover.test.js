"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _crypto = require("crypto"), _debug = _interopRequireDefault(require("debug")), _events = require("events"), _levelup = _interopRequireDefault(require("levelup")), _memdown = _interopRequireDefault(require("memdown")), _accountId = require("../../account_id"), _address = require("../../address"), _crs = require("../../crs"), _crypto1 = require("../../crypto"), _fft = require("../../fft"), _merkleTree = require("../../merkle_tree"), _noteAlgorithms = require("../../note_algorithms"), _pippenger = require("../../pippenger"), _wasm = require("../../wasm"), _proofData = require("../proof_data"), _prover = require("../prover"), _index = require("./index");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const debug = (0, _debug.default)('bb:account_proof_test');
jest.setTimeout(120000), describe('account proof', ()=>{
    let barretenberg, pool, noteAlgos, accountProver, accountVerifier, blake2s, pedersen, schnorr, crs, pippenger;
    beforeAll(async ()=>{
        _events.EventEmitter.defaultMaxListeners = 32;
        let circuitSize = _index.AccountProver.getCircuitSize();
        await (crs = new _crs.Crs(circuitSize)).download(), await (pool = new _wasm.WorkerPool()).init((barretenberg = await _wasm.BarretenbergWasm.new()).module, Math.min(navigator.hardwareConcurrency, 8)), await (pippenger = new _pippenger.PooledPippenger(pool)).init(crs.getData());
        let fft = new _fft.PooledFft(pool);
        await fft.init(circuitSize), blake2s = new _crypto1.Blake2s(barretenberg), pedersen = new _crypto1.SinglePedersen(barretenberg), schnorr = new _crypto1.Schnorr(barretenberg), noteAlgos = new _noteAlgorithms.NoteAlgorithms(barretenberg);
        let prover = new _prover.UnrolledProver(pool.workers[0], pippenger, fft);
        accountProver = new _index.AccountProver(prover), accountVerifier = new _index.AccountVerifier(), await accountProver.computeKey(), await accountVerifier.computeKey(pippenger.pool[0], crs.getG2Data());
    }), afterAll(async ()=>{
        await pool.destroy();
    });
    let createKeyPair = ()=>{
        let privateKey = (0, _crypto.randomBytes)(32), publicKey = new _address.GrumpkinAddress(schnorr.computePublicKey(privateKey));
        return {
            privateKey,
            publicKey
        };
    };
    it('should get key data', async ()=>{
        let provingKey = await accountProver.getKey();
        expect(provingKey.length).toBeGreaterThan(0);
        let verificationKey = await accountVerifier.getKey();
        expect(verificationKey.length).toBeGreaterThan(0);
    }), it('create and verify an account proof', async ()=>{
        let tree = new _merkleTree.MerkleTree((0, _levelup.default)((0, _memdown.default)()), pedersen, 'data', 32), user = createKeyPair(), newAccountPublicKey = user.publicKey, merkleRoot = tree.getRoot(), spendingKey0 = createKeyPair(), spendingKey1 = createKeyPair(), aliasHash = _accountId.AliasHash.fromAlias('user_zero', blake2s), accountPath = await tree.getHashPath(0), tx = new _index.AccountTx(merkleRoot, user.publicKey, newAccountPublicKey, spendingKey0.publicKey, spendingKey1.publicKey, aliasHash, !0, !1, 0, accountPath, user.publicKey), signingData = await accountProver.computeSigningData(tx), signature = schnorr.constructSignature(signingData, user.privateKey);
        debug('creating proof...');
        let start = new Date().getTime(), proof = await accountProver.createAccountProof(tx, signature);
        debug(`created proof: ${new Date().getTime() - start}ms`), debug(`proof size: ${proof.length}`);
        let verified = await accountVerifier.verifyProof(proof);
        expect(verified).toBe(!0);
        let accountProof = new _proofData.ProofData(proof), noteCommitment1 = noteAlgos.accountNoteCommitment(aliasHash, user.publicKey, spendingKey0.publicKey.x()), noteCommitment2 = noteAlgos.accountNoteCommitment(aliasHash, user.publicKey, spendingKey1.publicKey.x()), nullifier1 = noteAlgos.accountAliasHashNullifier(aliasHash), nullifier2 = noteAlgos.accountPublicKeyNullifier(newAccountPublicKey);
        expect(accountProof.proofId).toBe(_proofData.ProofId.ACCOUNT), expect(accountProof.noteCommitment1).toEqual(noteCommitment1), expect(accountProof.noteCommitment2).toEqual(noteCommitment2), expect(accountProof.nullifier1).toEqual(nullifier1), expect(accountProof.nullifier2).toEqual(nullifier2), expect(accountProof.publicValue).toEqual(Buffer.alloc(32)), expect(accountProof.publicOwner).toEqual(Buffer.alloc(32)), expect(accountProof.publicAssetId).toEqual(Buffer.alloc(32)), expect(accountProof.noteTreeRoot).toEqual(merkleRoot), expect(accountProof.txFee).toEqual(Buffer.alloc(32)), expect(accountProof.txFeeAssetId).toEqual(Buffer.alloc(32)), expect(accountProof.bridgeId).toEqual(Buffer.alloc(32)), expect(accountProof.defiDepositValue).toEqual(Buffer.alloc(32)), expect(accountProof.defiRoot).toEqual(Buffer.alloc(32));
    });
});
