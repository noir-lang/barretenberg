import { Buffer } from 'buffer';
import { isNode } from './isNode';
declare module globalThis {
    let Buffer: any;
}
if (isNode) {
    // NodeJS have Buffer present in global scope
} else {
    if (typeof globalThis.Buffer === "undefined") {
        globalThis.Buffer = Buffer;
    }
}
