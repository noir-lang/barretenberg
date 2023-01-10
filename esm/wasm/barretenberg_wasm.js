import { EventEmitter } from 'events';
import { createDebugLogger } from '../log';
import { randomBytes } from '../crypto';
import { MemoryFifo } from '../fifo';
EventEmitter.defaultMaxListeners = 30;
export async function fetchCode() {
    {
        let res = await fetch(new URL("barretenberg.wasm", import.meta.url));
        if (!res.ok) throw Error(`Could not get URL '${new URL("barretenberg.wasm", import.meta.url)}'`);
        return Buffer.from(await res.arrayBuffer());
    }
}
export class BarretenbergWasm extends EventEmitter {
    static async new(name = 'wasm', initial) {
        let barretenberg = new BarretenbergWasm();
        return barretenberg.on('log', createDebugLogger(`bb:${name}`)), await barretenberg.init(void 0, initial), barretenberg;
    }
    async init(module, initial = 256) {
        this.emit('log', `intial mem: ${initial}`), this.memory = new WebAssembly.Memory({
            initial,
            maximum: 65536
        }), this.heap = new Uint8Array(this.memory.buffer);
        let importObj = {
            wasi_snapshot_preview1: {
                environ_get: ()=>{},
                environ_sizes_get: ()=>{},
                fd_close: ()=>{},
                fd_read: ()=>{},
                fd_write: ()=>{},
                fd_seek: ()=>{},
                fd_fdstat_get: ()=>{},
                fd_fdstat_set_flags: ()=>{},
                path_open: ()=>{},
                path_filestat_get: ()=>{},
                proc_exit: ()=>{},
                random_get: (arr, length)=>{
                    arr >>>= 0;
                    let heap = new Uint8Array(this.memory.buffer), randomData = randomBytes(length);
                    for(let i = arr; i < arr + length; ++i)heap[i] = randomData[i - arr];
                }
            },
            module: {},
            env: {
                logstr: (addr)=>{
                    addr >>>= 0;
                    let m = this.getMemory(), i = addr;
                    for(; 0 !== m[i]; ++i);
                    let decoder = new TextDecoder(), str = decoder.decode(m.slice(addr, i)), str2 = `${str} (mem:${m.length})`;
                    this.emit('log', str2);
                },
                memory: this.memory
            }
        };
        if (module) this.instance = await WebAssembly.instantiate(module, importObj), this.module = module;
        else {
            let { instance , module: module1  } = await WebAssembly.instantiate(await fetchCode(), importObj);
            this.instance = instance, this.module = module1;
        }
    }
    exports() {
        return this.instance.exports;
    }
    call(name, ...args) {
        if (!this.exports()[name]) throw Error(`WASM function ${name} not found.`);
        try {
            return this.exports()[name](...args) >>> 0;
        } catch (err) {
            let message = `WASM function ${name} aborted, error: ${err}`;
            throw this.emit('log', message), Error(message);
        }
    }
    getMemory() {
        return 0 === this.heap.length ? new Uint8Array(this.memory.buffer) : this.heap;
    }
    memSize() {
        return this.getMemory().length;
    }
    sliceMemory(start, end) {
        return this.getMemory().slice(start, end);
    }
    transferToHeap(arr, offset) {
        let mem = this.getMemory();
        for(let i = 0; i < arr.length; i++)mem[i + offset] = arr[i];
    }
    async acquire() {
        await this.mutexQ.get();
    }
    release() {
        if (0 !== this.mutexQ.length()) throw Error('Release called but not acquired.');
        this.mutexQ.put(!0);
    }
    constructor(){
        super(), this.mutexQ = new MemoryFifo(), this.mutexQ.put(!0);
    }
}
