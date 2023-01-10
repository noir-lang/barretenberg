import createDebug from 'debug';
import { EventEmitter } from 'events';
import levelup from 'levelup';
import memdown from 'memdown';
import { AliasHash } from '../../account_id';
import { EthAddress, GrumpkinAddress } from '../../address';
import { Crs } from '../../crs';
import { Blake2s, Schnorr, Sha256, SinglePedersen } from '../../crypto';
import { Grumpkin } from '../../ecc';
import { PooledFft, SingleFft } from '../../fft';
import { MerkleTree } from '../../merkle_tree';
import { ClaimNoteTxData, NoteAlgorithms, TreeNote } from '../../note_algorithms';
import { PooledPippenger } from '../../pippenger';
import { numToUInt32BE } from '../../serialize';
import { BarretenbergWasm } from '../../wasm';
import { WorkerPool } from '../../wasm/worker_pool';
import { JoinSplitProofData, ProofData, ProofId } from '../proof_data';
import { UnrolledProver } from '../prover';
import { JoinSplitProver } from './join_split_prover';
import { JoinSplitTx } from './join_split_tx';
import { JoinSplitVerifier } from './join_split_verifier';
let debug = createDebug('bb:join_split_proof_test');
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
        EventEmitter.defaultMaxListeners = 32, await (crs = new Crs(65536)).download(), await (pool = new WorkerPool()).init((barretenberg = await BarretenbergWasm.new()).module, Math.min(navigator.hardwareConcurrency, 8)), await (pippenger = new PooledPippenger(pool)).init(crs.getData()), sha256 = new Sha256(barretenberg), blake2s = new Blake2s(barretenberg), pedersen = new SinglePedersen(barretenberg), schnorr = new Schnorr(barretenberg), grumpkin = new Grumpkin(barretenberg), noteAlgos = new NoteAlgorithms(barretenberg), joinSplitVerifier = new JoinSplitVerifier(), pubKey = new GrumpkinAddress(grumpkin.mul(Grumpkin.one, privateKey));
    }), afterAll(async ()=>{
        await pool.destroy();
    });
    let createAndCheckProof = async (joinSplitProver)=>{
        let publicValue = BigInt(0), publicOwner = EthAddress.ZERO, txFee = BigInt(20), inputNote1EphKey = createEphemeralPrivKey(grumpkin), inputNote2EphKey = createEphemeralPrivKey(grumpkin), outputNote1EphKey = createEphemeralPrivKey(grumpkin), outputNote2EphKey = createEphemeralPrivKey(grumpkin), inputNoteNullifier1 = numToUInt32BE(1, 32), inputNoteNullifier2 = numToUInt32BE(2, 32), inputNote1 = TreeNote.createFromEphPriv(pubKey, BigInt(100), 1, !1, inputNoteNullifier1, inputNote1EphKey, grumpkin), inputNote2 = TreeNote.createFromEphPriv(pubKey, BigInt(50), 1, !1, inputNoteNullifier2, inputNote2EphKey, grumpkin), inputNote1Enc = noteAlgos.valueNoteCommitment(inputNote1), inputNote2Enc = noteAlgos.valueNoteCommitment(inputNote2), expectedNullifier1 = noteAlgos.valueNoteNullifier(inputNote1Enc, privateKey), expectedNullifier2 = noteAlgos.valueNoteNullifier(inputNote2Enc, privateKey), outputNote1 = TreeNote.createFromEphPriv(pubKey, BigInt(80), 1, !0, expectedNullifier1, outputNote1EphKey, grumpkin), outputNote2 = TreeNote.createFromEphPriv(pubKey, BigInt(50), 1, !1, expectedNullifier2, outputNote2EphKey, grumpkin), tree = new MerkleTree(levelup(memdown()), pedersen, 'data', 32);
        await tree.updateElement(0, inputNote1Enc), await tree.updateElement(1, inputNote2Enc);
        let inputNote1Path = await tree.getHashPath(0), inputNote2Path = await tree.getHashPath(1), accountNotePath = await tree.getHashPath(2), aliasHash = AliasHash.fromAlias('user_zero', blake2s), tx = new JoinSplitTx(ProofId.SEND, publicValue, publicOwner, 1, 2, [
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
        ], ClaimNoteTxData.EMPTY, privateKey, aliasHash, !1, 2, accountNotePath, pubKey, Buffer.alloc(32), 0), signingData = await joinSplitProver.computeSigningData(tx), signature = schnorr.constructSignature(signingData, privateKey);
        debug('creating proof...');
        let start = new Date().getTime(), proof = await joinSplitProver.createProof(tx, signature);
        if (debug(`created proof: ${new Date().getTime() - start}ms`), debug(`proof size: ${proof.length}`), !joinSplitProver.mock) {
            let verified = await joinSplitVerifier.verifyProof(proof);
            expect(verified).toBe(!0);
        }
        let proofData = new ProofData(proof), joinSplitProofData = new JoinSplitProofData(proofData), noteCommitment1 = noteAlgos.valueNoteCommitment(outputNote1), noteCommitment2 = noteAlgos.valueNoteCommitment(outputNote2);
        expect(proofData.proofId).toEqual(ProofId.SEND), expect(proofData.noteCommitment1).toEqual(noteCommitment1), expect(proofData.noteCommitment2).toEqual(noteCommitment2), expect(proofData.nullifier1).toEqual(expectedNullifier1), expect(proofData.nullifier2).toEqual(expectedNullifier2), expect(joinSplitProofData.publicValue).toEqual(publicValue), expect(joinSplitProofData.publicOwner).toEqual(publicOwner), expect(joinSplitProofData.publicAssetId).toEqual(0), expect(proofData.noteTreeRoot).toEqual(tree.getRoot()), expect(joinSplitProofData.txFee).toEqual(txFee), expect(joinSplitProofData.txFeeAssetId).toEqual(1), expect(proofData.bridgeId).toEqual(Buffer.alloc(32)), expect(proofData.defiDepositValue).toEqual(Buffer.alloc(32)), expect(proofData.defiRoot).toEqual(Buffer.alloc(32)), expect(proofData.backwardLink).toEqual(Buffer.alloc(32)), expect(proofData.allowChain).toEqual(Buffer.alloc(32));
    };
    describe('join_split_mock_proof_generation', ()=>{
        let fft, joinSplitProver;
        beforeAll(async ()=>{
            await (fft = new SingleFft(pool.workers[0])).init(512);
            let prover = new UnrolledProver(pool.workers[0], pippenger, fft);
            joinSplitProver = new JoinSplitProver(prover, !0), debug('creating keys...');
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
            await (fft = new PooledFft(pool)).init(JoinSplitProver.getCircuitSize());
            let prover = new UnrolledProver(pool.workers[0], pippenger, fft);
            joinSplitProver = new JoinSplitProver(prover, !1), debug('creating keys...');
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
