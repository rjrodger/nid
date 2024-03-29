/* Copyright (c) 2013-2022 Richard Rodger, MIT License */


import Nid from '../nid'

let defruns = 100000

function def_id_fmt_ok(id: string) {
  return id.match(/^[0-9a-z]{6,6}$/)
}

function fmt_ok(opts: any) {
  if (opts.hex) {
    opts.alphabet = '0123456789abcdef'
  } else if (opts.HEX) {
    opts.alphabet = '0123456789ABCDEF'
  }

  let re = '^[' + opts.alphabet + ']+$'
  return function(id: string) {
    return id.length === (opts.length || 6) && id.match(re)
  }
}


function repeat(runs: any, nidf: any, passf: any) {
  let now = new Date().getTime()
  let nids = new Array(runs)
  for (let i = 0; i < runs; i++) {
    nids[i] = nidf()
  }
  let end = new Date().getTime()

  if (passf) {
    for (let i = 0; i < runs; i++) {
      passf(nids[i])
    }
  }

  return end - now
}

function report(name: string, runs: any, dur: number, opts: any) {
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
  test('works', function() {
    let default_cursed_list = Nid.curses()
    expect(Array.isArray(default_cursed_list))

    let id = Nid()
    expect(def_id_fmt_ok(id))
  })

  test('basic', function() {
    let dur = repeat(defruns, Nid, def_id_fmt_ok)
    report('basic', defruns, dur, Nid)
  })


  test('curses-spec', function() {
    let n0 = Nid({ len: 1, alphabet: 'abc', curses: 'a,b' })
    expect(n0()).toEqual('c')

    let n1 = Nid({ len: 1, alphabet: 'abc', curses: /[ab]/ })
    expect(n1()).toEqual('c')

    let n2 = Nid({
      len: 1, alphabet: 'abc',
      curses: (code: string) => code.match(/[ab]/)
    })
    expect(n2()).toEqual('c')
  })



  test('options.len', function() {
    let opts = { length: 8 }
    let nid8: Nid = Nid(opts)
    let id = nid8()
    expect(fmt_ok(opts)(id))

    id = Nid(8)
    expect(fmt_ok(opts)(id))

    // let opts1 = { len: 8 }
    let nid8a = Nid(opts)
    let ida = nid8a()
    expect(fmt_ok(opts)(ida))
  })

  test('options.uuid-ish', function() {
    let opts = { length: 32, hex: true, curses: false }
    let dur = repeat(defruns, Nid(opts), fmt_ok(opts))
    report('options.uuid-ish', defruns, dur, opts)
  })

  test('options.alphabet.a', function() {
    let opts = { length: 1, alphabet: 'a' }
    let dur = repeat(defruns, Nid(opts), fmt_ok(opts))
    report('options.alphabet.a', defruns, dur, opts)
  })

  test('options.alphabet.ab', function() {
    let opts = { length: 1, alphabet: 'ab' }
    let dur = repeat(defruns, Nid(opts), fmt_ok(opts))
    report('options.alphabet.ab', defruns, dur, opts)
  })

  test('options.hex', function() {
    let opts = { length: 1, hex: 1 }
    let dur = repeat(defruns, Nid(opts), fmt_ok(opts))
    report('options.hex', defruns, dur, opts)
  })

  test('options.HEX', function() {
    let opts = { length: 1, HEX: 1 }
    let dur = repeat(defruns, Nid(opts), fmt_ok(opts))
    report('options.HEX', defruns, dur, opts)
  })

  test('options.curses.array.one', function() {
    let opts = { length: 1, alphabet: 'ab', curses: ['b'] }
    let dur = repeat(defruns, Nid(opts), fmt_ok({ length: 1, alphabet: 'a' }))
    report('options.curses.array.one', defruns, dur, opts)
  })

  test('options.exclude.array.one', function() {
    let opts = { length: 1, alphabet: 'ab', exclude: ['b'] }
    let dur = repeat(defruns, Nid(opts), fmt_ok({ length: 1, alphabet: 'a' }))
    report('options.curses.array.one', defruns, dur, opts)
  })

  test('options.curses.array.many', function() {
    let opts = { length: 1, alphabet: 'abcd', curses: ['b', 'c'] }
    let dur = repeat(defruns, Nid(opts), fmt_ok({ length: 1, alphabet: 'ad' }))
    report('options.curses.array.many', defruns, dur, opts)
  })

  test('options.curses.csv.one', function() {
    let opts = { length: 1, alphabet: 'ab', curses: 'b' }
    let dur = repeat(defruns, Nid(opts), fmt_ok({ length: 1, alphabet: 'a' }))
    report('options.curses.csv.one', defruns, dur, opts)
  })

  test('options.curses.csv.many', function() {
    let opts = { length: 1, alphabet: 'abcd', curses: 'b,c' }
    let dur = repeat(defruns, Nid(opts), fmt_ok({ length: 1, alphabet: 'ad' }))
    report('options.curses.csv.many', defruns, dur, opts)
  })

  test('options.curses.re', function() {
    let opts = { length: 1, alphabet: 'ab', curses: /b/ }
    let dur = repeat(defruns, Nid(opts), fmt_ok({ length: 1, alphabet: 'a' }))
    report('options.curses.re', defruns, dur, opts)
  })

  test('options.curses.function', function() {
    let opts = {
      length: 1,
      alphabet: 'ab',
      curses: function(id: string) {
        return 'a' === id
      },
    }
    let dur = repeat(defruns, Nid(opts), fmt_ok({ length: 1, alphabet: 'a' }))
    report('options.curses.function', defruns, dur, opts)
  })

  test('options.curses.case', function() {
    let opts = { length: 1, alphabet: 'aAbB', curses: 'b' }
    let dur = repeat(defruns, Nid(opts), fmt_ok({ length: 1, alphabet: 'aA' }))
    report('options.curses.case', defruns, dur, opts)
  })
})
