# preact-youtube
This is an ultra rare youtube app, buy high, sell low.

## Demo

**[You can try the web application out here](https://swankytube.herokuapp.com)**

## Technology stack

**⭐️ [Preact](https://preactjs.com/) 🦄 [Babel](https://babeljs.io/) 🐣 [CSS modules](https://github.com/css-modules/css-modules) 🥒 [Cucumber](https://cucumber.io/) 🚨 [AVA](https://github.com/avajs/ava)**

## Debugging and building prerequisites

- [Node.js](https://nodejs.org/)
- [Google API key with Youtube Data API v3 access](https://console.developers.google.com/apis)
- Run `npm install`

Your Google API key must be accessible for debugging and building via the environmental variable `YOUTUBE_API_KEY`.


## Debugging

To start debugging run `npm run debug`, this will start a debug development server at http://localhost:9001.

## Building

To build the web application run `npm run build`, this will generate a static version of the web application in the directory `dist`.

## Testing

To lint the source code run `npm run lint`, this will report any linting issues, to unit test the source code run `npm run unit`, this will report any unit test failures and source coverage, to run end-to-end tests run `npm run e2e`, this will launch a debugging webdriver and http proxy for means of sandboxing the web application and will test and report various scenarios.

**To run all tests run `npm test`**
