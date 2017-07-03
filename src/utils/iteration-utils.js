export async function* skip(iterator, count) {

    let i = 0;

    // https://github.com/babel/babel-eslint/issues/415
    // eslint-disable-next-line semi
    for await (const item of iterator) {
        if (count > i++) continue;
        yield item;
    }

}

export async function* take(iterator, count) {

    let i = 0;

    // https://github.com/babel/babel-eslint/issues/415
    // eslint-disable-next-line semi
    for await (const item of iterator) {
        if (i++ === count) break;
        yield item;
    }

}

export async function* map(iterator, mapper) {

    // https://github.com/babel/babel-eslint/issues/415
    // eslint-disable-next-line semi
    for await (const item of iterator) yield mapper(item);

}

export async function toArray(iterator) {

    const results = [];

    // https://github.com/babel/babel-eslint/issues/415
    // eslint-disable-next-line semi
    for await (const item of iterator) results.push(item);

    return results;

}
