export const serialize = obj => {

    const keys = Object.keys(obj);

    if (keys.length === 0) return '';

    const pairs = keys.sort((a, b) => a.localeCompare(b)).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);

    return '?' + pairs.join('&');

};
