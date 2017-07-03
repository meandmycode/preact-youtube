export const serialize = obj => {

    const keys = Object.keys(obj);

    if (keys.length === 0) return '';

    const pairs = keys
        .sort((a, b) => a.localeCompare(b))
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);

    return '?' + pairs.join('&');

};

export const deserialize = str => {

    if (str[0] === '?') str = str.slice(1);

    if (str === '') return ({});

    const pairs = str.split('&');

    const obj = pairs.reduce((map, pair) => {

        const [key, value] = pair.split('=').map(decodeURIComponent);

        map[key] = value;

        return map;

    }, {});

    return obj;

};
