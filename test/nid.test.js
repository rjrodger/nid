/* Copyright (c) 2013 Richard Rodger, MIT License */
'use strict'

// mocha nid.test.js to test

var nid = require('..')

var assert = require('assert')

var defruns = 100000

function def_id_fmt_ok(id) {
  return id.match(/^[0-9a-z]{6,6}$/)
}

function fmt_ok(opts) {
  if (opts.hex) {
    opts.alphabet = '0123456789abcdef'
  } else if (opts.HEX) {
    opts.alphabet = '0123456789ABCDEF'
  }

  var re = '^[' + opts.alphabet + ']+$'
  return function(id) {
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
  console.log(
    name +
      ': ' +
      Math.floor(runs / (dur / 1000)) +
      ' ids per second; ' +
      runs +
      ' runs in ' +
      dur +
      'ms; len=' +
      opts.length +
      ' A=' +
      opts.alphabet
  )
}

describe('happy', function() {
  it('works', function() {
    var id = nid()
    assert.ok(def_id_fmt_ok(id))
    assert.ok(nid.curses.length>0)
  })

  it('basic', function() {
    var dur = repeat(defruns, nid, def_id_fmt_ok)
    report('basic', defruns, dur, nid.__defaults)
  })

  it('options.length', function() {
    var opts = { length: 8 }
    var nid8 = nid(opts)
    var id = nid8()
    assert.ok(fmt_ok(opts)(id))

    id = nid(8)
    assert.ok(fmt_ok(opts)(id))

    assert.ok(nid8.curses.length>0)
  })

  it('options.uuid-ish', function() {
    var opts = { length: 32, hex: true, curses: false }
    var dur = repeat(defruns, nid(opts), fmt_ok(opts))
    report('options.uuid-ish', defruns, dur, opts)
  })

  it('options.alphabet.a', function() {
    var opts = { length: 1, alphabet: 'a' }
    var dur = repeat(defruns, nid(opts), fmt_ok(opts))
    report('options.alphabet.a', defruns, dur, opts)
  })

  it('options.alphabet.ab', function() {
    var opts = { length: 1, alphabet: 'ab' }
    var dur = repeat(defruns, nid(opts), fmt_ok(opts))
    report('options.alphabet.ab', defruns, dur, opts)
  })

  it('options.hex', function() {
    var opts = { length: 1, hex: 1 }
    var dur = repeat(defruns, nid(opts), fmt_ok(opts))
    report('options.hex', defruns, dur, opts)
  })

  it('options.HEX', function() {
    var opts = { length: 1, HEX: 1 }
    var dur = repeat(defruns, nid(opts), fmt_ok(opts))
    report('options.HEX', defruns, dur, opts)
  })

  it('options.curses.array.one', function() {
    var opts = { length: 1, alphabet: 'ab', curses: ['b'] }
    var dur = repeat(defruns, nid(opts), fmt_ok({ length: 1, alphabet: 'a' }))
    report('options.curses.array.one', defruns, dur, opts)
  })

  it('options.exclude.array.one', function() {
    var opts = { length: 1, alphabet: 'ab', exclude: ['b'] }
    var dur = repeat(defruns, nid(opts), fmt_ok({ length: 1, alphabet: 'a' }))
    report('options.curses.array.one', defruns, dur, opts)
  })

  it('options.curses.array.many', function() {
    var opts = { length: 1, alphabet: 'abcd', curses: ['b', 'c'] }
    var dur = repeat(defruns, nid(opts), fmt_ok({ length: 1, alphabet: 'ad' }))
    report('options.curses.array.many', defruns, dur, opts)
  })

  it('options.curses.csv.one', function() {
    var opts = { length: 1, alphabet: 'ab', curses: 'b' }
    var dur = repeat(defruns, nid(opts), fmt_ok({ length: 1, alphabet: 'a' }))
    report('options.curses.csv.one', defruns, dur, opts)
  })

  it('options.curses.csv.many', function() {
    var opts = { length: 1, alphabet: 'abcd', curses: 'b,c' }
    var dur = repeat(defruns, nid(opts), fmt_ok({ length: 1, alphabet: 'ad' }))
    report('options.curses.csv.many', defruns, dur, opts)
  })

  it('options.curses.re', function() {
    var opts = { length: 1, alphabet: 'ab', curses: /b/ }
    var dur = repeat(defruns, nid(opts), fmt_ok({ length: 1, alphabet: 'a' }))
    report('options.curses.re', defruns, dur, opts)
  })

  it('options.curses.function', function() {
    var opts = {
      length: 1,
      alphabet: 'ab',
      curses: function(id) {
        return 'a' === id
      }
    }
    var dur = repeat(defruns, nid(opts), fmt_ok({ length: 1, alphabet: 'a' }))
    report('options.curses.function', defruns, dur, opts)
  })

  it('options.curses.case', function() {
    var opts = { length: 1, alphabet: 'aAbB', curses: 'b' }
    var dur = repeat(defruns, nid(opts), fmt_ok({ length: 1, alphabet: 'aA' }))
    report('options.curses.case', defruns, dur, opts)
  })
})
