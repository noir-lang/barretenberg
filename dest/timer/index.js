"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "Timer", {
    enumerable: !0,
    get: ()=>Timer
});
class Timer {
    ms() {
        return new Date().getTime() - this.start;
    }
    s() {
        return (new Date().getTime() - this.start) / 1000;
    }
    constructor(){
        this.start = new Date().getTime();
    }
}
