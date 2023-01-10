import isNode from "detect-node";
export function fetch(input, init) {
    if (isNode) {
        let f = require("node-fetch").default;
        return f(input, init);
    }
    if ("undefined" != typeof self && self.fetch) return self.fetch(input, init);
    if ("undefined" != typeof window && window.fetch) return window.fetch(input, init);
    throw Error("`fetch` api unavailable.");
}
