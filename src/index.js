import 'core-js/es6/promise';
import 'core-js/es6/symbol';
import 'core-js/es7/symbol';
import 'regenerator-runtime/runtime';
import { h, render } from 'preact';
import App from './containers/app';

const serverElement = document.querySelector('div');

render(<App />, document.body, serverElement);
