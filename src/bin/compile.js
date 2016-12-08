#!/usr/bin/env node

import { readFileSync, writeFileSync, statSync } from 'fs';
import path from 'path';

import { sync as mkdirp } from 'mkdirp';
import { red, green } from 'chalk';
import yargs from 'yargs';

import compile from '../compile';


let { _,
  output,
  locale,
  messages,
  ...compilerOptions
} = yargs
  .usage('Usage $0 <source> [args]')
  .option('output', { alias: 'o', string: true })
  .option('locale', { alias: 'l', string: true, array: true })
  .option('messages', { alias: 'm', string: true })
  .argv;

messages = messages ? JSON.parse(readFileSync(messages)) : null;

let patterns = _.map((file) => {
  let pattern = path.join(process.cwd(), file);
  const stat = statSync(pattern);
  if (!stat || stat.isDirectory()) {
    pattern = path.join(pattern, './**/*.js');
  }
  return pattern;
});

if (messages && !locale) {
  locale = Object.keys(messages);
}
else if (!locale) {
  locale = 'en'
}

[].concat(locale).forEach(locale => {
  const bundle = compile({
    locale,
    compilerOptions,
    patterns,
    messages,
  });

  if (bundle) {
    let name = path.basename(output, path.extname(output))

    let localOutput = path.join(
      path.dirname(output),
      name + '.' + locale + path.extname(output)
    )

    localOutput = path.isAbsolute(localOutput)
      ? localOutput : path.join(process.cwd(), localOutput)

    mkdirp(path.dirname(localOutput));

    writeFileSync(
      localOutput,
      bundle,
      'utf8'
    );
    console.log(green(`Writing locale file: ${localOutput}`));
  } else {
    console.log(red('No files matching the provided pattern'));
  }

})
