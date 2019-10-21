# @imqueue/sequelize

[![Build Status](https://travis-ci.org/imqueue/sequelize.svg?branch=master)](https://travis-ci.org/imqueue/sequelize)
[![David](https://img.shields.io/david/imqueue/sequelize.svg)](https://david-dm.org/imqueue/sequelize)
[![David](https://img.shields.io/david/dev/imqueue/sequelize.svg)](https://david-dm.org/imqueue/sequelize?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/imqueue/sequelize/badge.svg?targetFile=package.json)](https://snyk.io/test/github/imqueue/sequelize?targetFile=package.json)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](https://rawgit.com/imqueue/sequelize/master/LICENSE)

Sequelize ORM refines for @imqueue

# Install

~~~bash
npm i --save @imqueue/sequelize
~~~

# Docs

~~~bash
git clone git@github.com:imqueue/sequelize.git
npm run docs
~~~

# Usage

~~~typescript
import { database, query } from '@imqueue/sequelize';

const sequelize = database({
    logger: console,
    modelsPath: './src/orm/models',
    sequelize: {
        benchmark: true,
        dialect: 'postgres',
        storage: 'sequelize',
        pool: {
            max: 250,
            min: 2,
            idle: 30000,
            acquire: 30000,
        },
    },
});


~~~
