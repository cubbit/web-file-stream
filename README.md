# Web file stream [![Build Status](https://travis-ci.org/cubbit/web-file-stream.svg?branch=master)](https://travis-ci.org/cubbit/web-file-stream) ![license](https://img.shields.io/github/license/mashape/apistatus.svg) ![npm](https://img.shields.io/npm/v/npm.svg)

Node's file stream APIs for the web.

```ts
import {WebFileStream} from '@cubbit/web-file-stream';

const file = new File(['My test file'], 'test-file.txt', {
    type: 'text/plain'
});

const read_stream = WebFileStream.create_read_stream(file);

read_stream.on('error', console.error);
read_stream.on('data', (data) => console.log(data));
read_stream.on('end', () => console.log('File read!'));
```

## Installation

This is a module available through the npm registry.
Installation is done using the npm install command:

```bash
npm install @cubbit/web-file-stream
```

## Features

* Automatic backpressuring
* Compatibility with [File](https://developer.mozilla.org/en-US/docs/Web/API/File) object API
* Same API as Node.js [Stream](https://nodejs.org/api/stream.html) objects

## Tests

To run the test suite, first install the dependencies, then run npm test:

```bash
npm install
npm test
```

## License

 [MIT](LICENSE)
