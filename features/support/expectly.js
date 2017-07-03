const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function range(count, mapper) {

    const results = [];

    for (let i = 0; i < count; i++) {
        results.push(mapper(i));
    }

    return results;
}

const wrap = (template, fn) => {

    const argumentNames = range(template.length, i => new Array(i + 2).join('a'));

    // todo: look into setDefinitionFunctionWrapper
    // https://github.com/cucumber/cucumber-js/blob/43f06509e1d68dbbd99e7d901a8a7f12744ce90d/docs/support_files/step_definitions.md#definition-function-wrapper
    // we create a crazy wrapping function here as cucumber validates
    // the arguments of the handling function, which we're wrapping
    // eslint-disable-next-line no-new-func
    const wrapper = new Function('fn', `return function(${argumentNames}) { return fn.call(this, ${argumentNames}); }`);

    return wrapper(fn);

};

export const eventually = awaitable => wrap(awaitable, function(...args) {

    const maxDelay = 1000;

    let start = Date.now();

    const thunk = async () => {

        try {
            return await awaitable.apply(this, args);
        } catch (err) {

            const now = Date.now();
            const delta = now - start;

            if (delta >= maxDelay) throw err;

            await delay(10);

            return thunk();

        }

    };

    return thunk();

});
