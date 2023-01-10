import { sleep } from '../sleep';
import { Timer } from '../timer';
export function* backoffGenerator() {
    let v = [
        1,
        1,
        1,
        2,
        4,
        8,
        16,
        32,
        64
    ], i = 0;
    for(;;)yield v[Math.min(i++, v.length - 1)];
}
export async function retry(fn, name = 'Operation', backoff = backoffGenerator()) {
    for(;;)try {
        return await fn();
    } catch (err) {
        let s = backoff.next().value;
        if (void 0 === s) throw err;
        console.log(`${name} failed. Will retry in ${s}s...`), console.log(err), await sleep(1000 * s);
        continue;
    }
}
export async function retryUntil(fn, name = '', timeout = 0, interval = 1) {
    let timer = new Timer();
    for(;;){
        if (await fn()) return;
        if (await sleep(1000 * interval), timeout && timer.s() > timeout) throw Error(name ? `Timeout awaiting ${name}` : 'Timeout');
    }
}
