export const join = (...parts) => parts.reduce((a, b) => {

    if (a[a.length - 1] === '/' && b[0] === '/') return a + b.slice(1);
    else if (a[a.length - 1] === '/' || b[0] === '/') return a + b;

    return a + '/' + b;

});
