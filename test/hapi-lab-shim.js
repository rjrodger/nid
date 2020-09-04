/* Copyright (c) 2020 Richard Rodger, MIT License */
'use strict'

var tests = []
var print =
  'undefined' === typeof document
    ? console.log
    : function (s, nl) {
        var out = document.querySelector('#test-results') // eslint-disable-line
        out.innerHTML = out.innerHTML + s + (false === nl ? ' ' : '<br>')
      }

var Lab = {
  script: function () {
    return {
      it: web_it,
      describe: web_describe,
    }
  },
}

function web_it(name, opts, fn) {
  tests.push({ name: name, opts: opts, fn: fn || opts })
}

function web_describe(name, testdef) {
  print(name)
  testdef()

  runtest(tests.shift())
}

function runtest(test) {
  if (null == test) return

  print(test.name, false)

  try {
    var res = test.fn(function () {})

    if (res) {
      res.then(function (err) {
        if (err) {
          print('fail ' + err)
        } else {
          print('pass')
        }
        runtest(tests.shift())
      })
    } else {
      print('pass')
      runtest(tests.shift())
    }
  } catch (err) {
    print('fail ' + err)
  }
}

module.exports = Lab
