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
  patterns: [__dirname + '/output/test/**/*js'],
  messages: require('./fixtures/messages.json'),
  locale: 'fr',
})

console.log(bundle)
