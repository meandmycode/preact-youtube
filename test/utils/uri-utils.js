import 'babel-polyfill';
import test from 'ava';

import { joinPaths } from '../../src/utils/uri-utils';

test('can join a single path', assert => {
    assert.deepEqual(joinPaths('first'), 'first');
});

test('can join two paths', assert => {
    assert.deepEqual(joinPaths('first', 'second'), 'first/second');
    assert.deepEqual(joinPaths('first/', 'second'), 'first/second');
    assert.deepEqual(joinPaths('first', '/second'), 'first/second');
    assert.deepEqual(joinPaths('first/', '/second'), 'first/second');
});

test('can join many paths', assert => {
    assert.deepEqual(joinPaths('first', 'second', 'third'), 'first/second/third');
    assert.deepEqual(joinPaths('first/', 'second', 'third'), 'first/second/third');
    assert.deepEqual(joinPaths('first/', '/second', 'third'), 'first/second/third');
    assert.deepEqual(joinPaths('first', '/second', 'third'), 'first/second/third');
    assert.deepEqual(joinPaths('first', '/second/', 'third'), 'first/second/third');
    assert.deepEqual(joinPaths('first', 'second/', 'third'), 'first/second/third');
    assert.deepEqual(joinPaths('first', 'second/', '/third'), 'first/second/third');
    assert.deepEqual(joinPaths('first', 'second', '/third'), 'first/second/third');
});
