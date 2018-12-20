/*
 * @Author: kael
 * @Date: 2018-12-20 15:42:26
 * @Last Modified by: kael
 * @Last Modified time: 2018-12-20 16:52:44
 */

const root = './html';
const fs = require('fs');

const target = (name, text) => {
  return `<${name}>${text}</${name}>`;
};

let lis = '';
fs.readdirSync(root).forEach(file => {
  let filepath = `${root}/${file}`;
  let matchs = fs.readFileSync(filepath).toString().match(/<title>([^<]+)<\/title>/i);
  if (matchs) {
    lis += '\n    ' + target('li', `<a href="${filepath}">${matchs[1]}</a>`);
  }
});

fs.writeFileSync(
  './index.html',
  fs
    .readFileSync('./index.html')
    .toString()
    .replace('<!-- INDEX_PLACEHOLDER -->', `${target('ol', lis + '\n  ')}`)
);

