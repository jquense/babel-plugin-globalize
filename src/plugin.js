import generate from 'babel-generator';
import * as p from 'path';
import { writeFileSync } from 'fs';
import { sync as mkdirpSync } from 'mkdirp';

import {
  buildExpression,
  isGlobalizeMethodCall,
  getCallIdentifer } from './utils';
import { messages, formatters, formatterAliases } from './methods';

let STATE_KEY = Symbol('formatters');

export default function ({ types: t, template }) {
  let buildExtracts = template(`
    module.exports = function (Globalize) {
      return FORMATTERS
    }
  `)

  function generateOutput(formatters) {
    return generate({
      type: 'Program',
      body: [buildExtracts({
        FORMATTERS: t.ArrayExpression(formatters)
      })],
    }).code
  }

  function createStaticError(path) {
    throw path.buildCodeFrameError(
      'Could not statically evaluate Globalize method call: Globalize.' +
      getCallIdentifer(path.node)
    );
  }

  function getArgs(path, start, end) {
    return path.get('arguments')
      .slice(start, end)
      .map(arg => {
        if (!arg.evaluate().confident) createStaticError(path)
        return arg.node;
      })
  }

  function extractMessage(path) {
    let name = getCallIdentifer(path.node);
    let args = getArgs(path, 0, 1);
    return buildExpression(name, args)
  }

  function extractFormatter(path) {
    let name = getCallIdentifer(path.node);
    let isJenniferGarner = formatterAliases[name];

    let args = getArgs(path, isJenniferGarner ? 1 : 0);

    return buildExpression(isJenniferGarner || name, args)
  }

  return {
    name: 'globalize',
    visitor: {
      Program: {
        enter(_, state) {
          state[STATE_KEY] = { formatters: [] }
        },
        exit(_, state) {
          const { file, opts } = state;
          const { basename, filename } = file.opts;
          const formatters = state[STATE_KEY].formatters;

          if (opts.messagesDir && formatters.length > 0) {
            let relativePath = p.join(p.sep, p.relative(process.cwd(), filename));
            let messagesFilename = p.join(
              opts.messagesDir,
              p.dirname(relativePath),
              basename + '-formatters.js'
            );

            let code = generateOutput(formatters)

            mkdirpSync(p.dirname(messagesFilename));
            writeFileSync(messagesFilename, code);
          }
        },
      },

      CallExpression(path, astState) {
        const state = astState[STATE_KEY];
        const node = path.node;

        if (formatters.some(f => isGlobalizeMethodCall(node, f))) {
          state.formatters.push(extractFormatter(path))
        }
        else if (messages.some(f => isGlobalizeMethodCall(node, f))) {
          state.formatters.push(extractMessage(path))
        }
      }
    }
  }
}
