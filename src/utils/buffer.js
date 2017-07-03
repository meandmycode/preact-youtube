import { toArray, skip, take } from './iteration-utils';

export default class Buffer {

    done = false;
    pending = [];
    items = [];

    constructor(source) {
        this.source = source;
    }

    slice(start, end) {

        if (this.done || this.items.length >= end){
            return this.items.slice(start, end);
        }

        return toArray(take(skip(this, start), end - start));

    }

    async *[Symbol.asyncIterator]() {

        if (this.source == null) return;

        for (const item of this.pending) {

            const iteration = await item;

            if (iteration.done) break;

            yield iteration.value;

        }

        const iterator = this.source[Symbol.asyncIterator]();

        // whilst this kind of loop is discouraged, we're pending async operations
        // and interlacing into async iteration, we do this as whilst the async
        // iterator source we're reading from supports `for await`, we want to
        // record items that have been iterated (but perhaps not yet resolved) so
        // that we can record them for alternate iterations, this is required if
        // we are being iterated by multiple sources that are eagerly chasing the
        // async iteration source, as only one would receive the next pending value
        // eslint-disable-next-line no-constant-condition
        while (true) {

            const workItem = iterator.next();

            this.pending.push(workItem);

            const iteration = await workItem;

            if (iteration.done) break;

            this.items.push(iteration.value);

            yield iteration.value;

        }

        this.done = true;

    }

}
