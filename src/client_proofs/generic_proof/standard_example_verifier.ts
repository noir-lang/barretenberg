import { BarretenbergWorker } from '../../wasm/worker';
import { SinglePippenger } from '../../pippenger';
import { eth_contract_from_cs } from '@noir-lang/aztec_backend';

export class StandardExampleVerifier {
  private worker!: BarretenbergWorker;
  private ethSmartContract!: string;

  public async computeKey(pippenger: SinglePippenger, g2Data: Uint8Array) {
    this.worker = pippenger.getWorker();
    await this.worker.transferToHeap(g2Data, 0);
    await this.worker.call('standard_example__init_verification_key', pippenger.getPointer(), 0);
  }
  
  public async verifyProof(proof: Buffer) {
    const proofPtr = await this.worker.call('bbmalloc', proof.length);
    await this.worker.transferToHeap(proof, proofPtr);
    const verified = (await this.worker.call('standard_example__verify_proof', proofPtr, proof.length)) ? true : false;
    await this.worker.call('bbfree', proofPtr);
    return verified;
  }
  
  async computeSmartContract(pippenger: SinglePippenger, g2Data: Uint8Array, constraint_system : Uint8Array ) {

    const worker = pippenger.getWorker();

    const g2Ptr = await worker.call('bbmalloc', g2Data.length);
    await worker.transferToHeap(g2Data, g2Ptr);

    const buf = Buffer.from(constraint_system);
    const mem = await worker.call('bbmalloc', buf.length);
    await worker.transferToHeap(buf, mem);
    
    const vkSize = await worker.call('composer__smart_contract', pippenger.getPointer(), g2Ptr, mem,0);
    const vkPtr = Buffer.from(await worker.sliceMemory(0, 4)).readUInt32LE(0);
    let vkMethod =  Buffer.from(await worker.sliceMemory(vkPtr, vkPtr + vkSize)).toString();
    // This is done because the C++ code mangles the first line
    // We put dummy text (40 chars) on that line and slice it off on this side.
    // This is a todo on the C++ side, as this problem also exists in the rust code
    vkMethod = vkMethod.slice(40); 
    this.ethSmartContract = eth_contract_from_cs(vkMethod);
  }
  public SmartContract() {
    return this.ethSmartContract
  }
}