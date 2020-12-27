var assert = require('assert');
// var add = require('../add.js');
import { parseHTML } from '../src/parser.js';

describe('parse html:', function () {
  it('<a></a>', function () {
    let tree =  parseHTML('<a></a>');
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<a href="com" ></a>', function () {
    let tree =  parseHTML('<a href="com" ></a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<a href="com"></a>', function () {
    let tree =  parseHTML('<a href="com"></a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<a href></a>', function () {
    let tree =  parseHTML('<a href></a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<a href="233" id></a>', function () {
    let tree =  parseHTML('<a href="233" id></a>');  
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<a id=abc></a>', function () {
    let tree =  parseHTML('<a id=abc></a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<a id=abc />', function () {
    let tree =  parseHTML('<a id=abc />');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<a id=\'abc\' />', function () {
    let tree =  parseHTML('<a id=\'abc\' />');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<a />', function () {
    let tree =  parseHTML('<a />');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<a/>', function () {
    let tree =  parseHTML('<a/>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<A />upper case', function () {
    let tree =  parseHTML('<A />');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<>', function () {
    let tree =  parseHTML('<>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].type, "text");
  });

  it('<a>2333</a>', function () {
    let tree =  parseHTML('<a>2333</a>');
    assert.equal(tree.children.length, 1);
  });

})

