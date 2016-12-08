import { readFileSync, writeFileSync, statSync } from 'fs';
import path from 'path';

import { sync as mkdirp } from 'mkdirp';
import { red, green } from 'chalk';
import yargs from 'yargs';

import compile from '../compile';


let { _,
  output,
  messages,
  locale = 'en',
  ...compilerOptions
} = yargs
  .usage('Usage $0 <source> [args]')
  .option('output', { alias: 'o', string: true })
  .option('locale', { alias: 'l', string: true })
  .option('messages', { alias: 'm', string: true })
  .argv;

function toPatterns(files) {
  return files.map((file) => {
    let pattern = path.join(process.cwd(), file);
    const stat = statSync(pattern);
    if (!stat || stat.isDirectory()) {
      pattern = path.join(pattern, './**/*.js');
    }
    return pattern;
  });
}

const bundle = compile({
  locale,
  compilerOptions,
  patterns: toPatterns(_),
  messages: messages ? JSON.parse(readFileSync(messages)) : null,
});

if (bundle) {
  output = path.isAbsolute(output)
    ? output : path.join(process.cwd(), output)

  mkdirp(path.dirname(output));

  writeFileSync(
    output,
    bundle,
    'utf8'
  );
  console.log(green('All done'));
} else {
  console.log(red('No files matching the provided pattern'));
}
