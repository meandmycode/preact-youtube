export async function* skip(iterator, count) {

    let i = 0;

    for await (const item of iterator) {
        if (count > i++) continue;
        yield item;
    }

}

export async function* take(iterator, count) {

    let i = 0;

    for await (const item of iterator) {
        if (i++ === count) break;
        yield item;
    }

}

export async function* map(iterator, mapper) {
    for await (const item of iterator) yield mapper(item);
}

export async function toArray(iterator) {

    const results = [];

    for await (const item of iterator) results.push(item);

    return results;

}

export class Buffer {

    pending = [];

    constructor(source) {
        this.source = source;
    }

    async *[Symbol.asyncIterator]() {

        if (this.source == null) return;

        for (const item of this.pending) {

            const iteration = await item;

            if (iteration.done) break;

            yield iteration.value;

        }

        const iterator = this.source[Symbol.asyncIterator]();

        while (true) {

            const workItem = iterator.next();

            this.pending.push(workItem);

            const iteration = await workItem;

            if (iteration.done) break;

            yield iteration.value;

        }

    }

}
