/* Copyright (c) 2013 Richard Rodger, MIT License */
"use strict";

var nid = require('..')

var Lab = require('lab')
var Code = require('code')

var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var expect = Code.expect


var defruns = 100000


function def_id_fmt_ok(id) {
  return id.match(/^[0-9a-z]{6,6}$/)
}

function fmt_ok(opts) {
  if (opts.hex) {
    opts.alphabet = '0123456789abcdef'
  }
  else if (opts.HEX) {
    opts.alphabet = '0123456789ABCDEF'
  }

  var re = '^[' + opts.alphabet + ']+$'
  return function (id) {
    return id.length === (opts.length || 6) && id.match(re)
  }
}


function repeat(runs, nidf, passf) {
  var now = new Date().getTime()
  var nids = new Array(runs)
  for (var i = 0; i < runs; i++) {
    nids[i] = nidf()
  }
  var end = new Date().getTime()

  if (passf) {
    for (var i = 0; i < runs; i++) {
      passf(nids[i])
    }
  }

  return end - now
}


function report(name, runs, dur, opts) {
  console.log(name + ': ' + Math.floor(runs / (dur / 1000)) + ' ids per second; ' + runs + ' runs in ' + dur + 'ms; len=' + opts.length + ' A=' + opts.alphabet)
}

describe('nid', function () {

  it('works', function (done) {
    var id = nid()
    expect(def_id_fmt_ok(id)).to.exist()
    done()
  })


  it('basic', function (done) {
    var dur = repeat(defruns, nid, def_id_fmt_ok)
    report('basic', defruns, dur, nid.__defaults)
    done()
  })


  describe('options', function () {
    it('length', function (done) {
      var opts = {length: 8}
      var nid8 = nid(opts)
      var id = nid8()
      expect(fmt_ok(opts)(id)).to.exist()

      id = nid(8)
      expect(fmt_ok(opts)(id)).to.exist()
      done()
    })


    it('uuid-ish', function (done) {
      var opts = {length: 32, hex: true, curses: false}
      var dur = repeat(defruns, nid(opts), fmt_ok(opts))
      report('options.uuid-ish', defruns, dur, opts)
      done()
    })


    it('alphabet.a', function (done) {
      var opts = {length: 1, alphabet: 'a'}
      var dur = repeat(defruns, nid(opts), fmt_ok(opts))
      report('options.alphabet.a', defruns, dur, opts)
      done()
    })


    it('alphabet.ab', function (done) {
      var opts = {length: 1, alphabet: 'ab'}
      var dur = repeat(defruns, nid(opts), fmt_ok(opts))
      report('options.alphabet.ab', defruns, dur, opts)
      done()
    })


    it('hex', function (done) {
      var opts = {length: 1, hex: 1}
      var dur = repeat(defruns, nid(opts), fmt_ok(opts))
      report('options.hex', defruns, dur, opts)
      done()
    })


    it('HEX', function (done) {
      var opts = {length: 1, HEX: 1}
      var dur = repeat(defruns, nid(opts), fmt_ok(opts))
      report('options.HEX', defruns, dur, opts)
      done()
    })

    it('exclude.array.one', function (done) {
      var opts = {length: 1, alphabet: 'ab', exclude: ['b']}
      var dur = repeat(defruns, nid(opts), fmt_ok({length: 1, alphabet: 'a'}))
      report('options.curses.array.one', defruns, dur, opts)
      done()
    })


    describe('curses', function () {

      it('array.one', function (done) {
        var opts = {length: 1, alphabet: 'ab', curses: ['b']}
        var dur = repeat(defruns, nid(opts), fmt_ok({length: 1, alphabet: 'a'}))
        report('options.curses.array.one', defruns, dur, opts)
        done()
      })

      it('array.many', function (done) {
        var opts = {length: 1, alphabet: 'abcd', curses: ['b', 'c']}
        var dur = repeat(defruns, nid(opts), fmt_ok({length: 1, alphabet: 'ad'}))
        report('options.curses.array.many', defruns, dur, opts)
        done()
      })


      it('csv.one', function (done) {
        var opts = {length: 1, alphabet: 'ab', curses: 'b'}
        var dur = repeat(defruns, nid(opts), fmt_ok({length: 1, alphabet: 'a'}))
        report('options.curses.csv.one', defruns, dur, opts)
        done()
      })


      it('csv.many', function (done) {
        var opts = {length: 1, alphabet: 'abcd', curses: 'b,c'}
        var dur = repeat(defruns, nid(opts), fmt_ok({length: 1, alphabet: 'ad'}))
        report('options.curses.csv.many', defruns, dur, opts)
        done()
      })


      it('re', function (done) {
        var opts = {length: 1, alphabet: 'ab', curses: /b/}
        var dur = repeat(defruns, nid(opts), fmt_ok({length: 1, alphabet: 'a'}))
        report('options.curses.re', defruns, dur, opts)
        done()
      })


      it('function', function (done) {
        var opts = {
          length: 1, alphabet: 'ab', curses: function (id) {
            return 'a' === id
          }
        }
        var dur = repeat(defruns, nid(opts), fmt_ok({length: 1, alphabet: 'a'}))
        report('options.curses.function', defruns, dur, opts)
        done()
      })


      it('case', function (done) {
        var opts = {length: 1, alphabet: 'aAbB', curses: 'b'}
        var dur = repeat(defruns, nid(opts), fmt_ok({length: 1, alphabet: 'aA'}))
        report('options.curses.case', defruns, dur, opts)
        done()
      })
    })
  })

})
