/* Copyright (c) 2013 Richard Rodger, MIT License */
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

var defaults = {
  len: 6,
  alphabet: '0123456789abcdefghijklmnopqrstuvwxyz',

  // function hidecurse(s) {o='';for(i=0; i<s.length; i++){o+='\\'+'x'+(s.charCodeAt(i).toString(16).toUpperCase())} console.log(o); }
  curses: [
    '\x66\x75\x63\x6B',
    '\x73\x68\x69\x74',
    '\x70\x69\x73\x73',
    '\x63\x75\x6E\x74',
    '\x74\x69\x74\x73',
    '\x6E\x69\x67\x67\x65\x72',
    '\x63\x6F\x63\x6B\x73\x75\x63\x6B\x65\x72',
    '\x6D\x6F\x74\x68\x65\x72\x66\x75\x63\x6B\x65\x72',
    '\x66\x72\x61\x63\x6B',
    '\x66\x72\x61\x6B',
    '\x62\x69\x74\x63\x68',
    '\x61\x73\x73\x68\x6F\x6C\x65',
    '\x77\x68\x6F\x72\x65',
    '\x63\x6F\x63\x6B',
    '\x74\x77\x61\x74',
    '\x77\x61\x6E\x6B',
    '\x73\x6C\x75\x74'
  ]
}

var default_cursed = cursing(defaults.curses)

function cursing(curses) {
  var typestr = Object.prototype.toString.call(curses).substring(8)

  if ('String]' == typestr) {
    curses = curses.split(/\s*,\s*/)
  }

  if (Array.isArray(curses)) {
    return function(code) {
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
      return function(code) {
        return !!code.match(curses)
      }
    } else
      return function() {
        return false
      }
  }
}

function generate(opts) {
  var len = defaults.len
  var alphabet = defaults.alphabet
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
  
  ;['len', 'alphabet', 'curses'].forEach(function(setting) {
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
  nid.curses = ()=>curses
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
        len: arg0
      })
    } else if ('Object]' === typestr) {
      return make(arg0)
    } else return generate()
  }

  return generate()
}

nid.curses = ()=>defaults.curses
nid.len = defaults.len
nid.alphabet = defaults.alphabet

module.exports = nid
