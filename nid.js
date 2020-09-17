/* Copyright (c) 2013-2020 Richard Rodger, MIT License */
'use strict'

/* Module API:
 * var nid = require('nid')
 * nid() // returns new random id as string
 * nid({options}) // returns new nid function that generates ids using options
 *
 * options are:
 *   len: number of chars in id
 *   alphabet: alphabet to take chars from randomly
 *   hex, HEX: alphabet is hexadecimal, lower or upper case respectively (overrides alphabet)
 *   exclude,curses: (exlude overrides)
 *     array of strings - excluded if contained in id
 *     string: comma-separated list of curses
 *     regexp: excluded if matches
 *     function: return true if exluded, first arg is id
 *
 */

var dc = (y, t) => y.map((x) => x.map((n) => String.fromCharCode(n)).join(''))
var cl = [
  [0x66, 0x75, 0x63, 0x6b],
  [0x73, 0x68, 0x69, 0x74],
  [0x70, 0x69, 0x73, 0x73],
  [0x63, 0x75, 0x6e, 0x74],
  [0x74, 0x69, 0x74, 0x73],
  [0x6e, 0x69, 0x67, 0x67, 0x65, 0x72],
  [0x6e, 0x69, 0x67, 0x67, 0x61],
  [0x63, 0x6f, 0x63, 0x6b, 0x73, 0x75, 0x63, 0x6b, 0x65, 0x72],
  [0x6d, 0x6f, 0x74, 0x68, 0x65, 0x72, 0x66, 0x75, 0x63, 0x6b, 0x65, 0x72],
  [0x66, 0x72, 0x61, 0x63, 0x6b],
  [0x66, 0x72, 0x61, 0x6b],
  [0x62, 0x69, 0x74, 0x63, 0x68],
  [0x61, 0x73, 0x73, 0x68, 0x6f, 0x6c, 0x65],
  [0x77, 0x68, 0x6f, 0x72, 0x65],
  [0x63, 0x6f, 0x63, 0x6b],
  [0x74, 0x77, 0x61, 0x74],
  [0x77, 0x61, 0x6e, 0x6b],
  [0x73, 0x6c, 0x75, 0x74],
  [0x70, 0x75, 0x73, 0x73, 0x79],
]

var defaults = {
  len: 6,
  alphabet: '0123456789abcdefghijklmnopqrstuvwxyz',
}

var default_cursed = null
var default_cursed_list = null

function cursing(curses) {
  var typestr = Object.prototype.toString.call(curses).substring(8)

  if ('String]' == typestr) {
    curses = curses.split(/\s*,\s*/)
  }

  if (Array.isArray(curses)) {
    return function (code) {
      var codelower = code.toLowerCase()
      for (var i = 0; i < curses.length; i++) {
        if (-1 != codelower.indexOf(curses[i])) {
          return true
        }
      }
    }
  } else {
    if ('Function]' == typestr) {
      return curses
    } else if ('RegExp]' == typestr) {
      return function (code) {
        return !!code.match(curses)
      }
    } else
      return function () {
        return false
      }
  }
}

function generate(opts) {
  var len = defaults.len
  var alphabet = defaults.alphabet

  if (null == default_cursed) {
    default_cursed_list = dc(cl, Date.now())
    default_cursed = cursing(default_cursed_list)
  }

  var cursed = default_cursed

  if (opts) {
    len = opts.length || opts.len || len
    alphabet = opts.alphabet || alphabet
    cursed = opts.curses ? cursing(opts.curses) : cursed
  }

  var code = null,
    numchars = alphabet.length

  do {
    var time = new Date().getTime()
    var sb = []
    for (var i = 0; i < len; i++) {
      var c = Math.floor((time * Math.random()) % numchars)
      sb.push(alphabet[c])
    }
    code = sb.join('')
  } while (cursed(code))

  return code
}

function make(opts) {
  opts.len = opts.len || opts.length
  ;['len', 'alphabet', 'curses'].forEach(function (setting) {
    opts[setting] = void 0 === opts[setting] ? defaults[setting] : opts[setting]
  })

  if (opts.hex) {
    opts.alphabet = '0123456789abcdef'
  } else if (opts.HEX) {
    opts.alphabet = '0123456789ABCDEF'
  }

  // exclude overrides curses
  opts.curses = opts.exclude || opts.curses

  var nid = function nid() {
    return generate(opts)
  }

  var curses = opts.curses
  delete opts.curses
  nid.curses = () => curses || default_cursed
  nid.len = opts.len
  nid.alphabet = opts.alphabet

  return nid
}

function nid() {
  var arg0 = arguments[0]
  if (arg0) {
    var typestr = Object.prototype.toString.call(arg0).substring(8)

    if ('Number]' === typestr) {
      return generate({
        len: arg0,
      })
    } else if ('Object]' === typestr) {
      return make(arg0)
    } else return generate()
  }

  return generate()
}

// ensure default_cursed_list is generated
nid()

nid.curses = () => default_cursed_list
nid.len = defaults.len
nid.alphabet = defaults.alphabet

module.exports = nid
