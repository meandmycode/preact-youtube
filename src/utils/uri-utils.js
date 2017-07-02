import { deserialize } from './query-string';

export const join = (...parts) => parts.reduce((a, b) => {

    if (a[a.length - 1] === '/' && b[0] === '/') return a + b.slice(1);
    else if (a[a.length - 1] === '/' || b[0] === '/') return a + b;

    return a + '/' + b;

});

export const parse = str => {

    const anchor = document.createElement('a');
    anchor.href = str;

    const { pathname, search } = anchor;

    const query = deserialize(search);

    return {
        pathname,
        search,
        query,
    };

};
