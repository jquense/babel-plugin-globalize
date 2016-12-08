require('babel-register');

var { transformFileSync } = require('babel-core');
var plugin = require('../src/plugin');
var compile = require('../src/compile');


transformFileSync(__dirname + '/fixtures/basic.js', {
  plugins: [
    [plugin, { messagesDir: 'test/output'}],
  ],
})


let bundle = compile({
  patterns: [__dirname + '/output/**/*js'],
  compilerOptions: {
    defaultLocale: 'fr',
    messages: require('./fixtures/messages.json'),
  }
})

console.log(bundle)
