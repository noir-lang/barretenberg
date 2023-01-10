import { spawn, Thread, Worker } from 'threads';
import { createDebugLogger } from '../log';
import isNode from 'detect-node';
export async function createWorker(id, module, initial, timeout = 300000) {
    let debug = createDebugLogger(`bb:wasm${id ? ":" + id : ""}`);
    try {
        let thread;
        return (thread = isNode ? await spawn(new Worker("worker.js"), {
            timeout
        }) : await spawn(new Worker(new URL("worker.js", import.meta.url)), {
            timeout
        })).logs().subscribe(debug), await thread.init(module, initial), thread;
    } catch (e) {
        throw Error(`Could not spawn new Worker from URL '${new URL("./worker.js", import.meta.url)}', Cause: ${e}`);
    }
}
export async function destroyWorker(worker) {
    await Thread.terminate(worker);
}
