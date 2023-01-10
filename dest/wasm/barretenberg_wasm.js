"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    fetchCode: ()=>fetchCode,
    BarretenbergWasm: ()=>BarretenbergWasm
});
const _fs = require("fs"), _util = require("util"), _events = require("events"), _log = require("../log"), _crypto = require("../crypto"), _fifo = require("../fifo");
async function fetchCode() {
    return await (0, _util.promisify)(_fs.readFile)(__dirname + '/barretenberg.wasm');
}
_events.EventEmitter.defaultMaxListeners = 30;
class BarretenbergWasm extends _events.EventEmitter {
    static async new(name = 'wasm', initial) {
        let barretenberg = new BarretenbergWasm();
        return barretenberg.on('log', (0, _log.createDebugLogger)(`bb:${name}`)), await barretenberg.init(void 0, initial), barretenberg;
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
                    let heap = new Uint8Array(this.memory.buffer), randomData = (0, _crypto.randomBytes)(length);
                    for(let i = arr; i < arr + length; ++i)heap[i] = randomData[i - arr];
                }
            },
            module: {},
            env: {
                logstr: (addr)=>{
                    addr >>>= 0;
                    let m = this.getMemory(), i = addr;
                    for(; 0 !== m[i]; ++i);
                    let decoder = new (require('util')).TextDecoder(), str = decoder.decode(m.slice(addr, i)), str2 = `${str} (mem:${m.length})`;
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
        super(), this.mutexQ = new _fifo.MemoryFifo(), this.mutexQ.put(!0);
    }
}
