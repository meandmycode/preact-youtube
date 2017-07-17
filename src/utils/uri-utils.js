import { deserialize } from './query-string';

export const joinPaths = (...parts) => parts.reduce((a, b) => {

    if (a[a.length - 1] === '/' && b[0] === '/') return a + b.slice(1);
    else if (a[a.length - 1] === '/' || b[0] === '/') return a + b;

    return a + '/' + b;

});

export const parse = str => {

    const match = str.match(/(.+)(\?.+)/);

    const pathname = match ? match[1] : str;
    const search = match ? match[2] : null;
    const query = search ? deserialize(search) : {};

    return {
        pathname,
        search,
        query,
    };

};
