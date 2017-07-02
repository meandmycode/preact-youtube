export async function reduce(source, reducer, seed) {

    let last = seed;
    let i = 0;

    for (const item of source) {
        last = await reducer(last, item, i++);
    }

    return last;

}

export async function find(source, predicate) {

    let i = 0;

    for (const item of source) {
        if (await predicate(item, i++)) return item;
    }


}