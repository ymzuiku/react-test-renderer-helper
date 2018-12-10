'use strict';

exports.__esModule = true;

window.__testerCache = {};
window.__testerIsTest = true;

var tester__defaultKey = 'tester__defaultKey';
function tester__setStatus(a, b) {
  if (typeof window === 'undefined' || !window.__testerIsTest) {
    return;
  }
  var obj, key;
  if (typeof b === 'undefined') {
    key = tester__defaultKey;
    obj = a;
  } else {
    key = a;
    obj = b;
  }
  window.__testerCache[key] = obj;
}
function tester__getStatus(key) {
  if (typeof key === 'undefined') {
    key = tester__defaultKey;
  }
  return window.__testerCache[key];
}
function tester__clearStatus(key) {
  if (typeof key === 'undefined') {
    key = tester__defaultKey;
  }
  if (key === '*') {
    window.__testerCache = {};
    tester__default.status = window.__testerCache;
  } else {
    delete window.__testerCache[key];
    tester__default.status = window.__testerCache;
  }
}
var tester__default = {
  setStatus: tester__setStatus,
  getStatus: tester__getStatus,
  clearStatus: tester__clearStatus,
  status: window.__testerCache,
};

exports.default = tester__default;
module.exports = exports['default'];
