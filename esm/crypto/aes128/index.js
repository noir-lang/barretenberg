export class Aes128 {
    encryptBufferCBC(data, iv, key) {
        let rawLength = data.length, numPaddingBytes = rawLength % 16 != 0 ? 16 - rawLength % 16 : 0, paddingBuffer = Buffer.alloc(numPaddingBytes);
        0 != numPaddingBytes && paddingBuffer.fill(numPaddingBytes);
        let input = Buffer.concat([
            data,
            paddingBuffer
        ]), mem = this.wasm.call('bbmalloc', input.length + key.length + iv.length + input.length);
        this.wasm.transferToHeap(input, mem), this.wasm.transferToHeap(iv, mem + input.length), this.wasm.transferToHeap(key, mem + input.length + iv.length), this.wasm.call('aes__encrypt_buffer_cbc', mem, mem + input.length, mem + input.length + iv.length, input.length, mem + input.length + iv.length + key.length);
        let result = Buffer.from(this.wasm.sliceMemory(mem + input.length + key.length + iv.length, mem + input.length + key.length + iv.length + input.length));
        return this.wasm.call('bbfree', mem), result;
    }
    decryptBufferCBC(data, iv, key) {
        let mem = this.wasm.call('bbmalloc', data.length + key.length + iv.length + data.length);
        this.wasm.transferToHeap(data, mem), this.wasm.transferToHeap(iv, mem + data.length), this.wasm.transferToHeap(key, mem + data.length + iv.length), this.wasm.call('aes__decrypt_buffer_cbc', mem, mem + data.length, mem + data.length + iv.length, data.length, mem + data.length + iv.length + key.length);
        let result = Buffer.from(this.wasm.sliceMemory(mem + data.length + key.length + iv.length, mem + data.length + key.length + iv.length + data.length));
        return this.wasm.call('bbfree', mem), result;
    }
    constructor(wasm){
        this.wasm = wasm;
    }
}
