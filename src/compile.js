import glob from 'glob';

import { compileExtracts } from 'globalize-compiler';

const template = ({ code, dependencies }) => (`

var Globalize = require('globalize/dist/globalize-runtime');
${dependencies.map(d => `
require('globalize/dist/${d}');`).join('')}

${code}

module.exports = Globalize;
`);

export default function compile({ patterns, messages, locale, compilerOptions }) {
  const files = patterns
    .map(pattern => glob.sync(pattern))
    .reduce((arr, next) => [...arr, ...next], [])

  if (!files.length) return

  let extracts = files.map(filepath => require(filepath)); // eslint-disable-line

  return compileExtracts({
    ...compilerOptions,
    extracts,
    messages,
    template,
    defaultLocale: locale,
  })
}
