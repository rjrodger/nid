(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).Nid=e()}}((function(){var e={};Object.defineProperty(e,"__esModule",{value:!0});const n=[[102,117,99,107],[115,104,105,116],[99,117,110,116],[110,105,103,103],[99,111,99,107],[115,117,99,107],[98,105,116,99,104],[97,115,115],[104,111,108,101],[119,104,111,114,101],[119,97,110,107],[115,108,117,116],[112,117,115,115],[101,114,114,111,114]],t={len:6,alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"};let l,o;function f(e){return"string"==typeof e&&(e=e.split(/\s*,\s*/)),Array.isArray(e)?function(n){const t=n.toLowerCase();for(let l=0;l<e.length;l++)if(-1!=t.indexOf(e[l]))return!0}:"function"==typeof e?e:e instanceof RegExp?n=>!!n.match(e):()=>!1}function r(e){let r=t.len||0,u=t.alphabet;null==l&&(o=n.map(e=>e.map(e=>String.fromCharCode(e)).join("")),l=f(o));let a=l;e&&(r=e.length||e.len||r||0,u=e.alphabet||u,a=e.curses?f(e.curses):a),u=null==u?"":u;let s=null;const i=u.length||0;do{const e=(new Date).getTime(),n=[];for(let t=0;t<r;t++){const t=Math.floor(e*Math.random()%i);n.push(u[t])}s=n.join("")}while(a(s));return s}function u(e){return e?"number"==typeof e?r({len:e}):"object"==typeof e?function(e){e.len=e.len||e.length,["len","alphabet","curses"].forEach((function(n){e[n]=void 0===e[n]?t[n]:e[n]})),e.hex?e.alphabet="0123456789abcdef":e.HEX&&(e.alphabet="0123456789ABCDEF"),e.curses=e.exclude||e.curses;let n=function(){return r(e)};const o=e.curses;return n.curses=()=>o||l,n.len=e.len,n.alphabet=e.alphabet,n}(e):r():r()}return u(),u.curses=()=>o,u.len=t.len,u.alphabet=t.alphabet,e.default=u,e=u}));
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
// Run: npm run test-web

// A quick and dirty abomination to partially run the unit tests inside an
// actual browser by simulating some of the Jest API.

const Jester = window.Jester = {
  exclude: [],
  state: {
    describe: {},
    unit: {},
    fail: {},
  }
}

// Ensure keys are sorted when JSONified.
function stringify(o) {
  if(null === o) return 'null'
  if('symbol' === typeof o) return String(o)
  if('object' !== typeof o) return ''+o
  return JSON.stringify(
    Object.keys(o)
      .sort()
      .reduce((a,k)=>(a[k]=o[k],a),{}),
    stringify) // Recusively!
}

function print(s) {
  let test = document.getElementById('test')
  test.innerHTML = test.innerHTML + s + '<br>'
}


window.describe = function(name, tests) {
  Jester.state.describe = { name }
  tests()
}
window.test = function(name, unit) {
  if(Jester.exclude.includes(name)) return;

  try {
    Jester.state.unit = { name }
    unit()
    // console.log('PASS:', name)
    print('PASS: '+name)
  }
  catch(e) {
    console.log(e)
    print('FAIL: '+name)
    print(e.message+'<br><pre>'+e.stack+'</pre>')
  }
}
window.expect = function(sval) {

  function pass(cval,ok) {
    // console.log('pass',cval,ok)
    if(!ok) {
      let state = Jester.state
      state.fail.found = sval
      state.fail.expected = cval
      let err =  new Error('FAIL: '+state.describe.name+' '+state.unit.name)
      throw err
    }
  }

  function passEqualJSON(cval) {
    let sjson = stringify(sval)
    let cjson = stringify(cval)

    let ok = sjson === cjson
    pass(cval, ok)
  }

  return {
    toEqual: (cval)=>{
      passEqualJSON(cval)
    },
    toBeTruthy: (cval)=>pass(cval,!!cval),
    toBeFalsy: (cval)=>pass(cval,!cval),
    toBeDefined: (cval)=>pass(cval,undefined!==sval),
    toBeUndefined: (cval)=>pass(cval,undefined===sval),
    toMatch: (cval)=>pass(cval,sval.match(cval)),
    toThrow: (cval)=>{
      try {
        sval()
        pass(cval,false)
      }
      catch(e) {
        pass(cval,true)
      }
    },
    toMatchObject: (cval)=>{
      passEqualJSON(cval)
    },
  }
}


require('./nid.test.js')

},{"./nid.test.js":3}],3:[function(require,module,exports){
"use strict";
/* Copyright (c) 2013-2022 Richard Rodger, MIT License */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nid_1 = __importDefault(require("../nid"));
let defruns = 100000;
function def_id_fmt_ok(id) {
    return id.match(/^[0-9a-z]{6,6}$/);
}
function fmt_ok(opts) {
    if (opts.hex) {
        opts.alphabet = '0123456789abcdef';
    }
    else if (opts.HEX) {
        opts.alphabet = '0123456789ABCDEF';
    }
    let re = '^[' + opts.alphabet + ']+$';
    return function (id) {
        return id.length === (opts.length || 6) && id.match(re);
    };
}
function repeat(runs, nidf, passf) {
    let now = new Date().getTime();
    let nids = new Array(runs);
    for (let i = 0; i < runs; i++) {
        nids[i] = nidf();
    }
    let end = new Date().getTime();
    if (passf) {
        for (let i = 0; i < runs; i++) {
            passf(nids[i]);
        }
    }
    return end - now;
}
function report(name, runs, dur, opts) {
    console.log(name +
        ': ' +
        Math.floor(runs / (dur / 1000)) +
        ' ids per second; ' +
        runs +
        ' runs in ' +
        dur +
        'ms; len=' +
        opts.length +
        ' A=' +
        opts.alphabet);
}
describe('happy', function () {
    test('works', function () {
        let default_cursed_list = nid_1.default.curses();
        expect(Array.isArray(default_cursed_list));
        let id = (0, nid_1.default)();
        expect(def_id_fmt_ok(id));
    });
    test('basic', function () {
        let dur = repeat(defruns, nid_1.default, def_id_fmt_ok);
        report('basic', defruns, dur, nid_1.default);
    });
    test('curses-spec', function () {
        let n0 = (0, nid_1.default)({ len: 1, alphabet: 'abc', curses: 'a,b' });
        expect(n0()).toEqual('c');
        let n1 = (0, nid_1.default)({ len: 1, alphabet: 'abc', curses: /[ab]/ });
        expect(n1()).toEqual('c');
        let n2 = (0, nid_1.default)({
            len: 1, alphabet: 'abc',
            curses: (code) => code.match(/[ab]/)
        });
        expect(n2()).toEqual('c');
    });
    test('options.len', function () {
        let opts = { length: 8 };
        let nid8 = (0, nid_1.default)(opts);
        let id = nid8();
        expect(fmt_ok(opts)(id));
        id = (0, nid_1.default)(8);
        expect(fmt_ok(opts)(id));
        // let opts1 = { len: 8 }
        let nid8a = (0, nid_1.default)(opts);
        let ida = nid8a();
        expect(fmt_ok(opts)(ida));
    });
    test('options.uuid-ish', function () {
        let opts = { length: 32, hex: true, curses: false };
        let dur = repeat(defruns, (0, nid_1.default)(opts), fmt_ok(opts));
        report('options.uuid-ish', defruns, dur, opts);
    });
    test('options.alphabet.a', function () {
        let opts = { length: 1, alphabet: 'a' };
        let dur = repeat(defruns, (0, nid_1.default)(opts), fmt_ok(opts));
        report('options.alphabet.a', defruns, dur, opts);
    });
    test('options.alphabet.ab', function () {
        let opts = { length: 1, alphabet: 'ab' };
        let dur = repeat(defruns, (0, nid_1.default)(opts), fmt_ok(opts));
        report('options.alphabet.ab', defruns, dur, opts);
    });
    test('options.hex', function () {
        let opts = { length: 1, hex: 1 };
        let dur = repeat(defruns, (0, nid_1.default)(opts), fmt_ok(opts));
        report('options.hex', defruns, dur, opts);
    });
    test('options.HEX', function () {
        let opts = { length: 1, HEX: 1 };
        let dur = repeat(defruns, (0, nid_1.default)(opts), fmt_ok(opts));
        report('options.HEX', defruns, dur, opts);
    });
    test('options.curses.array.one', function () {
        let opts = { length: 1, alphabet: 'ab', curses: ['b'] };
        let dur = repeat(defruns, (0, nid_1.default)(opts), fmt_ok({ length: 1, alphabet: 'a' }));
        report('options.curses.array.one', defruns, dur, opts);
    });
    test('options.exclude.array.one', function () {
        let opts = { length: 1, alphabet: 'ab', exclude: ['b'] };
        let dur = repeat(defruns, (0, nid_1.default)(opts), fmt_ok({ length: 1, alphabet: 'a' }));
        report('options.curses.array.one', defruns, dur, opts);
    });
    test('options.curses.array.many', function () {
        let opts = { length: 1, alphabet: 'abcd', curses: ['b', 'c'] };
        let dur = repeat(defruns, (0, nid_1.default)(opts), fmt_ok({ length: 1, alphabet: 'ad' }));
        report('options.curses.array.many', defruns, dur, opts);
    });
    test('options.curses.csv.one', function () {
        let opts = { length: 1, alphabet: 'ab', curses: 'b' };
        let dur = repeat(defruns, (0, nid_1.default)(opts), fmt_ok({ length: 1, alphabet: 'a' }));
        report('options.curses.csv.one', defruns, dur, opts);
    });
    test('options.curses.csv.many', function () {
        let opts = { length: 1, alphabet: 'abcd', curses: 'b,c' };
        let dur = repeat(defruns, (0, nid_1.default)(opts), fmt_ok({ length: 1, alphabet: 'ad' }));
        report('options.curses.csv.many', defruns, dur, opts);
    });
    test('options.curses.re', function () {
        let opts = { length: 1, alphabet: 'ab', curses: /b/ };
        let dur = repeat(defruns, (0, nid_1.default)(opts), fmt_ok({ length: 1, alphabet: 'a' }));
        report('options.curses.re', defruns, dur, opts);
    });
    test('options.curses.function', function () {
        let opts = {
            length: 1,
            alphabet: 'ab',
            curses: function (id) {
                return 'a' === id;
            },
        };
        let dur = repeat(defruns, (0, nid_1.default)(opts), fmt_ok({ length: 1, alphabet: 'a' }));
        report('options.curses.function', defruns, dur, opts);
    });
    test('options.curses.case', function () {
        let opts = { length: 1, alphabet: 'aAbB', curses: 'b' };
        let dur = repeat(defruns, (0, nid_1.default)(opts), fmt_ok({ length: 1, alphabet: 'aA' }));
        report('options.curses.case', defruns, dur, opts);
    });
});

},{"../nid":1}]},{},[2]);
