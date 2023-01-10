import { Keccak } from 'sha3';
import { ProofId } from './proof_id';
let hash = new Keccak(256);
export function createTxId(rawProofData) {
    let proofId = rawProofData.readUInt32BE(28), txIdData = proofId === ProofId.DEFI_DEPOSIT ? Buffer.concat([
        rawProofData.slice(0, 32),
        Buffer.alloc(32),
        rawProofData.slice(64)
    ]) : rawProofData;
    return hash.reset(), hash.update(txIdData).digest();
}
