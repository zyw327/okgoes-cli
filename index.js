#!/usr/bin/env node
const Build = require('./lib/build');
const build = new Build();
const arguments = process.argv.splice(2);
build.build(process.cwd(), arguments[0]);
