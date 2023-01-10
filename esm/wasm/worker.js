let wasm;
import '../buffer.js';
import { Subject, Observable } from 'threads/observable';
import { expose, Transfer } from 'threads/worker';
import { BarretenbergWasm } from '.';
let subject = new Subject();
expose({
    async init (module, initial) {
        (wasm = new BarretenbergWasm()).on('log', (str)=>subject.next(str)), await wasm.init(module, initial);
    },
    async transferToHeap (buffer, offset) {
        wasm.transferToHeap(buffer, offset);
    },
    async sliceMemory (start, end) {
        let mem = wasm.sliceMemory(start, end);
        return Transfer(mem, [
            mem.buffer
        ]);
    },
    call: async (name, ...args)=>wasm.call(name, ...args),
    memSize: async ()=>wasm.memSize(),
    logs: ()=>Observable.from(subject),
    async acquire () {
        await wasm.acquire();
    },
    async release () {
        wasm.release();
    }
});
