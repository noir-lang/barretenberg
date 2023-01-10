import { BarretenbergWorker } from './worker';
import { spawn, Thread, Worker } from 'threads';
import { createDebugLogger } from '../log';
import isNode from 'detect-node';


export async function createWorker(
  id?: string,
  module?: WebAssembly.Module,
  initial?: number,
  timeout = 5 * 60 * 1000,
) {
  const debug = createDebugLogger(`bb:wasm${id ? ":" + id : ""}`);

  try {
    let thread;
    if (isNode) {
      thread = await spawn<BarretenbergWorker>(
        // following format `Worker(URL, ...)` is required for bundlers to recognise this as worker
        ///@ts-ignore
        new Worker("worker.js"),
        { timeout }
      );

    } else {
      thread = await spawn<BarretenbergWorker>(
        // following format `Worker(URL, ...)` is required for bundlers to recognise this as worker
        ///@ts-ignore
        new Worker(new URL("worker.js", import.meta.url)),
        { timeout }
      );
    }
    thread.logs().subscribe(debug);
    await thread.init(module, initial);
    return thread;
  } catch (e) {
    ///@ts-ignore
    throw new Error(`Could not spawn new Worker from URL '${new URL("./worker.js", import.meta.url)}', Cause: ${e}`);
  }
}

export async function destroyWorker(worker: BarretenbergWorker) {
  await Thread.terminate(worker as any);
}
