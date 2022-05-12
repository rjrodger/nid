/* Copyright (c) 2013-2022 Richard Rodger, MIT License */


const dc =
  (y: number[][]) =>
    y.map((x) => x.map((n: number) => String.fromCharCode(n)).join(''))

const cl = [
  [0x66, 0x75, 0x63, 0x6b],
  [0x73, 0x68, 0x69, 0x74],
  [0x63, 0x75, 0x6e, 0x74],
  [0x6e, 0x69, 0x67, 0x67],
  [0x63, 0x6f, 0x63, 0x6b],
  [0x73, 0x75, 0x63, 0x6b],
  [0x62, 0x69, 0x74, 0x63, 0x68],
  [0x61, 0x73, 0x73],
  [0x68, 0x6f, 0x6c, 0x65],
  [0x77, 0x68, 0x6f, 0x72, 0x65],
  [0x77, 0x61, 0x6e, 0x6b],
  [0x73, 0x6c, 0x75, 0x74],
  [0x70, 0x75, 0x73, 0x73],
  [0x65, 0x72, 0x72, 0x6F, 0x72],
]

type CurseSpec = string | string[] | RegExp | ((code: string) => boolean)

type NidOpts = {
  len?: number
  length?: number // legacy
  alphabet?: string
  curses?: CurseSpec
  exclude?: CurseSpec
  hex?: boolean
  HEX?: boolean
}

const defaults: NidOpts = {
  len: 6,
  alphabet: '0123456789abcdefghijklmnopqrstuvwxyz',
}

let default_cursed: any
let default_cursed_list: any


function cursing(curses: CurseSpec) {
  if ('string' == typeof curses) {
    curses = curses.split(/\s*,\s*/)
  }

  if (Array.isArray(curses)) {
    return function(code: string) {
      const codelower = code.toLowerCase()
      for (let i = 0; i < (curses as string[]).length; i++) {
        if (-1 != codelower.indexOf((curses as string[])[i])) {
          return true
        }
      }
    }
  }
  else if ('function' == typeof curses) {
    return curses
  }
  else if (curses instanceof RegExp) {
    return (code: string) => !!code.match(curses as RegExp)
  }
  else return () => false
}


function generate(opts?: NidOpts) {
  let len = defaults.len || 0
  let alphabet = defaults.alphabet

  if (null == default_cursed) {
    default_cursed_list = dc(cl)
    default_cursed = cursing(default_cursed_list)

    // Uncomment to review curses.
    // console.log(default_cursed_list)
  }

  let cursed = default_cursed

  if (opts) {
    len = opts.length || opts.len || len || 0
    alphabet = opts.alphabet || alphabet
    cursed = opts.curses ? cursing(opts.curses) : cursed
  }

  alphabet = null == alphabet ? '' : alphabet
  let code = null
  const numchars = alphabet.length || 0

  do {
    const time = new Date().getTime()
    const sb = []
    for (let i = 0; i < len; i++) {
      const c = Math.floor((time * Math.random()) % numchars)
      sb.push(alphabet[c])
    }
    code = sb.join('')
  } while (cursed(code))

  return code
}

function make(opts: NidOpts) {
  opts.len = opts.len || opts.length
    ;['len', 'alphabet', 'curses'].forEach(function(setting) {
      (opts as any)[setting] =
        void 0 === (opts as any)[setting] ?
          (defaults as any)[setting] : (opts as any)[setting]
    })

  if (opts.hex) {
    opts.alphabet = '0123456789abcdef'
  } else if (opts.HEX) {
    opts.alphabet = '0123456789ABCDEF'
  }

  // exclude overrides curses
  opts.curses = opts.exclude || opts.curses

  let nid: any = function nid() {
    return generate(opts)
  }

  const curses = opts.curses
  nid.curses = () => curses || default_cursed
  nid.len = opts.len
  nid.alphabet = opts.alphabet

  return nid
}


function Nid(spec?: number | object) {
  if (spec) {
    if ('number' === typeof spec) {
      return generate({
        len: spec,
      })
    } else if ('object' === typeof spec) {
      return make(spec)
    } else return generate()
  }

  return generate()
}


// ensure default_cursed_list is generated
Nid()

Nid.curses = () => default_cursed_list
Nid.len = defaults.len
Nid.alphabet = defaults.alphabet

type Nid = typeof Nid
export type { Nid }

export default Nid

module.exports = Nid

