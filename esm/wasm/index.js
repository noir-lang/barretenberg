import { EventEmitter } from 'events';
export * from './barretenberg_wasm';
export * from './worker_pool';
export * from './worker_factory';
//REMOVED BY BUILD: export { BarretenbergWorker } from './worker';
EventEmitter.defaultMaxListeners = 30;
export async function fetchCode() {
    {
        let res = await fetch(new URL("barretenberg.wasm", import.meta.url));
        if (!res.ok) throw Error(`Could not get URL '${new URL("barretenberg.wasm", import.meta.url)}'`);
        return Buffer.from(await res.arrayBuffer());
    }
}
