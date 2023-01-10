import { Transfer } from 'threads';
export class SinglePippenger {
    async init(crsData) {
        let crsPtr = await this.wasm.call('bbmalloc', crsData.length);
        this.numPoints = crsData.length / 64, await this.wasm.transferToHeap(crsData, crsPtr), this.pippengerPtr = await this.wasm.call('new_pippenger', crsPtr, this.numPoints), await this.wasm.call('bbfree', crsPtr);
    }
    async destroy() {
        await this.wasm.call('delete_pippenger', this.pippengerPtr);
    }
    async pippengerUnsafe(scalars, from, range) {
        let mem = await this.wasm.call('bbmalloc', scalars.length);
        return await this.wasm.transferToHeap(Transfer(scalars, [
            scalars.buffer
        ]), mem), await this.wasm.call('pippenger_unsafe', this.pippengerPtr, mem, from, range, 0), await this.wasm.call('bbfree', mem), Buffer.from(await this.wasm.sliceMemory(0, 96));
    }
    async sumElements(buffer) {
        let mem = await this.wasm.call('bbmalloc', buffer.length);
        return await this.wasm.transferToHeap(buffer, mem), await this.wasm.call('g1_sum', mem, buffer.length / 96, 0), await this.wasm.call('bbfree', mem), Buffer.from(await this.wasm.sliceMemory(0, 96));
    }
    getPointer() {
        return this.pippengerPtr;
    }
    getWorker() {
        return this.wasm;
    }
    constructor(wasm){
        this.wasm = wasm;
    }
}
