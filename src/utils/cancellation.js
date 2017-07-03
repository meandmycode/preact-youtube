export default class Cancellation {

    canceled = false;
    listeners = new Set();

    constructor(initializer) {

        initializer(() => {

            if (this.canceled) return;

            this.canceled = true;

            this.listeners.forEach(fn => fn());

        });

    }

    addListener(fn) {
        this.listeners.add(fn);
    }

    removeListener(fn) {
        this.listeners.delete(fn);
    }

    static create() {

        let cancellor;

        const cancellation = new Cancellation(c => cancellor = c);

        return [cancellation, cancellor];

    }

}
