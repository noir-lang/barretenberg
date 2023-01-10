export class Timer {
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
