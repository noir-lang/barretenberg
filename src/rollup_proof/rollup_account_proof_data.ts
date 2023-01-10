import { ProofId } from '../client_proofs';
import { InnerProofData } from './inner_proof';

export class RollupAccountProofData {
  static ENCODED_LENGTH = 1 + 4 * 32;

  constructor(public readonly proofData: InnerProofData) {
    if (proofData.proofId !== ProofId.ACCOUNT) {
      throw new Error('Not an account proof.');
    }
  }

  get ENCODED_LENGTH() {
    return RollupAccountProofData.ENCODED_LENGTH;
  }

  static decode(encoded: Buffer) {
    const proofId = encoded.readUInt8(0);
    if (proofId !== ProofId.ACCOUNT) {
      throw new Error('Not an account proof.');
    }

    let offset = 1;
    const noteCommitment1 = encoded.slice(offset, offset + 32);
    offset += 32;
    const noteCommitment2 = encoded.slice(offset, offset + 32);
    offset += 32;
    const nullifier1 = encoded.slice(offset, offset + 32);
    offset += 32;
    const nullifier2 = encoded.slice(offset, offset + 32);
    return new RollupAccountProofData(
      new InnerProofData(
        ProofId.ACCOUNT,
        noteCommitment1,
        noteCommitment2,
        nullifier1,
        nullifier2,
        Buffer.alloc(32),
        Buffer.alloc(32),
        Buffer.alloc(32),
      ),
    );
  }

  encode() {
    const { noteCommitment1, noteCommitment2, nullifier1, nullifier2 } = this.proofData;
    return Buffer.concat([Buffer.from([ProofId.ACCOUNT]), noteCommitment1, noteCommitment2, nullifier1, nullifier2]);
  }
}
