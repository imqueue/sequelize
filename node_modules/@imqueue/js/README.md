# @imqueue/js

[![Build Status](https://travis-ci.org/imqueue/js.svg?branch=master)](https://travis-ci.org/imqueue/js)
[![codebeat badge](https://codebeat.co/badges/95d6374b-e10f-4a99-b892-8849b92bca0a)](https://codebeat.co/projects/github-com-imqueue-js-master)
[![Coverage Status](https://coveralls.io/repos/github/imqueue/js/badge.svg?branch=master)](https://coveralls.io/github/imqueue/js?branch=master)
[![David](https://img.shields.io/david/imqueue/js.svg)](https://david-dm.org/imqueue/js)
[![David](https://img.shields.io/david/dev/imqueue/js.svg)](https://david-dm.org/imqueue/js?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/imqueue/js/badge.svg?targetFile=package.json)](https://snyk.io/test/github/imqueue/js?targetFile=package.json)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](https://rawgit.com/imqueue/js/master/LICENSE)


JavaScript routines used withing @imqueue framework

# Docs

~~~
git clone git@github.com:imqueue/js.git
npm run docs
~~~

# Usage

~~~typescript
import { js, object } from '@imqueue/js';
import isObject = js.isObject;
import get = object.get;

const obj = { { a: { b: { c: true } } } };

if (!isObject(obj)) {
    throw new TypeError('Object required!');
}

console.log(get(obj, 'a.b.c'));
~~~

## License

[ISC](https://github.com/imqueue/js/blob/master/LICENSE)
