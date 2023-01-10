import { randomBytes } from 'crypto';
import createDebug from 'debug';
import { EventEmitter } from 'events';
import levelup from 'levelup';
import memdown from 'memdown';
import { AliasHash } from '../../account_id';
import { GrumpkinAddress } from '../../address';
import { Crs } from '../../crs';
import { Blake2s, Schnorr, SinglePedersen } from '../../crypto';
import { PooledFft } from '../../fft';
import { MerkleTree } from '../../merkle_tree';
import { NoteAlgorithms } from '../../note_algorithms';
import { PooledPippenger } from '../../pippenger';
import { BarretenbergWasm, WorkerPool } from '../../wasm';
import { ProofData, ProofId } from '../proof_data';
import { UnrolledProver } from '../prover';
import { AccountProver, AccountTx, AccountVerifier } from './index';
let debug = createDebug('bb:account_proof_test');
jest.setTimeout(120000), describe('account proof', ()=>{
    let barretenberg, pool, noteAlgos, accountProver, accountVerifier, blake2s, pedersen, schnorr, crs, pippenger;
    beforeAll(async ()=>{
        EventEmitter.defaultMaxListeners = 32;
        let circuitSize = AccountProver.getCircuitSize();
        await (crs = new Crs(circuitSize)).download(), await (pool = new WorkerPool()).init((barretenberg = await BarretenbergWasm.new()).module, Math.min(navigator.hardwareConcurrency, 8)), await (pippenger = new PooledPippenger(pool)).init(crs.getData());
        let fft = new PooledFft(pool);
        await fft.init(circuitSize), blake2s = new Blake2s(barretenberg), pedersen = new SinglePedersen(barretenberg), schnorr = new Schnorr(barretenberg), noteAlgos = new NoteAlgorithms(barretenberg);
        let prover = new UnrolledProver(pool.workers[0], pippenger, fft);
        accountProver = new AccountProver(prover), accountVerifier = new AccountVerifier(), await accountProver.computeKey(), await accountVerifier.computeKey(pippenger.pool[0], crs.getG2Data());
    }), afterAll(async ()=>{
        await pool.destroy();
    });
    let createKeyPair = ()=>{
        let privateKey = randomBytes(32), publicKey = new GrumpkinAddress(schnorr.computePublicKey(privateKey));
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
        let tree = new MerkleTree(levelup(memdown()), pedersen, 'data', 32), user = createKeyPair(), newAccountPublicKey = user.publicKey, merkleRoot = tree.getRoot(), spendingKey0 = createKeyPair(), spendingKey1 = createKeyPair(), aliasHash = AliasHash.fromAlias('user_zero', blake2s), accountPath = await tree.getHashPath(0), tx = new AccountTx(merkleRoot, user.publicKey, newAccountPublicKey, spendingKey0.publicKey, spendingKey1.publicKey, aliasHash, !0, !1, 0, accountPath, user.publicKey), signingData = await accountProver.computeSigningData(tx), signature = schnorr.constructSignature(signingData, user.privateKey);
        debug('creating proof...');
        let start = new Date().getTime(), proof = await accountProver.createAccountProof(tx, signature);
        debug(`created proof: ${new Date().getTime() - start}ms`), debug(`proof size: ${proof.length}`);
        let verified = await accountVerifier.verifyProof(proof);
        expect(verified).toBe(!0);
        let accountProof = new ProofData(proof), noteCommitment1 = noteAlgos.accountNoteCommitment(aliasHash, user.publicKey, spendingKey0.publicKey.x()), noteCommitment2 = noteAlgos.accountNoteCommitment(aliasHash, user.publicKey, spendingKey1.publicKey.x()), nullifier1 = noteAlgos.accountAliasHashNullifier(aliasHash), nullifier2 = noteAlgos.accountPublicKeyNullifier(newAccountPublicKey);
        expect(accountProof.proofId).toBe(ProofId.ACCOUNT), expect(accountProof.noteCommitment1).toEqual(noteCommitment1), expect(accountProof.noteCommitment2).toEqual(noteCommitment2), expect(accountProof.nullifier1).toEqual(nullifier1), expect(accountProof.nullifier2).toEqual(nullifier2), expect(accountProof.publicValue).toEqual(Buffer.alloc(32)), expect(accountProof.publicOwner).toEqual(Buffer.alloc(32)), expect(accountProof.publicAssetId).toEqual(Buffer.alloc(32)), expect(accountProof.noteTreeRoot).toEqual(merkleRoot), expect(accountProof.txFee).toEqual(Buffer.alloc(32)), expect(accountProof.txFeeAssetId).toEqual(Buffer.alloc(32)), expect(accountProof.bridgeId).toEqual(Buffer.alloc(32)), expect(accountProof.defiDepositValue).toEqual(Buffer.alloc(32)), expect(accountProof.defiRoot).toEqual(Buffer.alloc(32));
    });
});
