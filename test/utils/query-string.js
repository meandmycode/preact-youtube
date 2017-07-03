import 'babel-polyfill';
import test from 'ava';

import { serialize, deserialize } from '../../src/utils/query-string';

test('can serialize an empty object', assert => {

    const expected = '';
    const actual = serialize({});

    assert.deepEqual(actual, expected);

});

test('can serialize an object with a single property', assert => {

    const expected = '?a=42';
    const actual = serialize({ a: 42 });

    assert.deepEqual(actual, expected);

});

test('can serialize an object with a single property that needs encoding', assert => {

    const expected = '?a=foo%26bar';
    const actual = serialize({ a: 'foo&bar' });

    assert.deepEqual(actual, expected);

});

test('can serialize an object with multiple properties', assert => {

    const expected = '?a=42&b=foo';
    const actual = serialize({ a: 42, b: 'foo' });

    assert.deepEqual(actual, expected);

});

test('can serialize an object with multiple properties alphabetically ordered', assert => {

    const expected = '?a=42&b=foo';
    const actual = serialize({ b: 'foo', a: 42 });

    assert.deepEqual(actual, expected);

});

test('can deserialize an empty string', assert => {

    const expected = {};
    const actual = deserialize('');

    assert.deepEqual(actual, expected);

});

test('can deserialize an questionmark string', assert => {

    const expected = {};
    const actual = deserialize('?');

    assert.deepEqual(actual, expected);

});

test('can deserialize a single property query string', assert => {

    const expected = { a: '42' };
    const actual = deserialize('?a=42');

    assert.deepEqual(actual, expected);

});

test('can deserialize a single property query string with an encoded value', assert => {

    const expected = { a: 'foo&bar' };
    const actual = deserialize('?a=foo%26bar');

    assert.deepEqual(actual, expected);

});

test('can deserialize a multiple property query string', assert => {

    const expected = { a: '42', b: 'foo' };
    const actual = deserialize('?a=42&b=foo');

    assert.deepEqual(actual, expected);

});

test('can deserialize a single property query string without a preceding questionmark', assert => {

    const expected = { a: '42' };
    const actual = deserialize('a=42');

    assert.deepEqual(actual, expected);

});

test('can deserialize a multiple property query string without a preceding questionmark', assert => {

    const expected = { a: '42', b: 'foo' };
    const actual = deserialize('a=42&b=foo');

    assert.deepEqual(actual, expected);

});
