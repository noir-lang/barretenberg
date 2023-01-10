import { readFile } from 'fs';
import { isNode } from '../isNode';
import { promisify } from 'util';
import { EventEmitter } from 'events';

export * from './barretenberg_wasm';
export * from './worker_pool';
export * from './worker_factory';
export { BarretenbergWorker } from './worker';

EventEmitter.defaultMaxListeners = 30;

export async function fetchCode() {
  if (isNode) {
    return await promisify(readFile)(__dirname + '/barretenberg.wasm');
  } else {
    ///@ts-ignore
    const res = await fetch(new URL("barretenberg.wasm", import.meta.url));
    if (!res.ok) {
      ///@ts-ignore
      throw new Error(`Could not get URL '${new URL("barretenberg.wasm", import.meta.url)}'`);
    }
    return Buffer.from(await res.arrayBuffer());
  }
}
