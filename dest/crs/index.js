"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "Crs", {
    enumerable: !0,
    get: ()=>Crs
});
const _isoFetch = require("../iso_fetch");
class Crs {
    async download() {
        let g1End = 28 + 64 * this.numPoints - 1, response = await (0, _isoFetch.fetch)('https://aztec-ignition.s3.amazonaws.com/MAIN%20IGNITION/sealed/transcript00.dat', {
            headers: {
                Range: `bytes=28-${g1End}`
            }
        });
        this.data = new Uint8Array(await response.arrayBuffer()), await this.downloadG2Data();
    }
    async downloadG2Data() {
        let response2 = await (0, _isoFetch.fetch)('https://aztec-ignition.s3.amazonaws.com/MAIN%20IGNITION/sealed/transcript00.dat', {
            headers: {
                Range: "bytes=322560028-322560155"
            }
        });
        this.g2Data = new Uint8Array(await response2.arrayBuffer());
    }
    getData() {
        return this.data;
    }
    getG2Data() {
        return this.g2Data;
    }
    constructor(numPoints){
        this.numPoints = numPoints;
    }
}
