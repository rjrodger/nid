# nid

### Nice clean-mouthed random id generation, without any swearing!

A Node.js module that generates random identifiers for public consumption. Swear words not included.

### Support

If you're using this module, feel free to contact me on twitter if you have any questions! :) [@rjrodger](http://twitter.com/rjrodger)

Current Version: 0.1.0

Tested on: node 0.8.16


### What it Does

This module is useful for custom short links, password generation and
any sort of unique tag an end user might see. 

By default the [big seven curse words](http://en.wikipedia.org/wiki/Seven_dirty_words) are avoided
(thanks [@dshaw](http://twitter.com/dshaw)!).


### Quick example

```JavaScript
var nid = require('nid')

// generate a 6 character alphanumberic id, like: ytnzt2
console.log(nid())

```


## Install

```sh
npm install nid
```


## Options

You can change the ids generated by passing an options object to the
_nid_ function. A new, custom, function is returned. For example:

```JavaScript
var mynid = require('nid')({length:8})

// generate an 8 character alphanumberic id, like: qnzvetvp
console.log( mynid() )
```

You have the following options:

   * _length_: number of characters in the id string
   * _alphabet_: a string containing the set of characters in the id, e.g. 1234567890abcdef
   * _curses_: specify the list of curse words to avoid (you can use _exclude_ as an alias if you don't want to sound quaint)

You can specify the curses as:

   * an array of strings: ["gosh","darn"]
   * a CSV formatted string: "gosh, darn"
   * a regular expression: matches are excluded
   * a function: first arg is the proposed id, return true to exclude

As a convenience you can use the following alphabet shortcuts:

   * _hex_: alphabet is '0123456789abcdef'
   * _HEX_: alphabet is '0123456789ABCDEF'

### Examples:

```JavaScript
var nid = require('nid')

var nid_ABC = nid({alphabet:'ABC'})
console.log(nid_ABC()) // prints something like BCCABB

var nid_hex = nid({hex:1})
console.log(nid_hex()) // prints something like 47b5df

var nid_noa = nid({curses:/a/})
console.log(nid_noa()) // never includes an 'a' character
```

## How it Works

Keep getting a random character from a given alphabet of characters,
until you have enough to meet the length requirement. Then check if it
contains a curse word (case-insensitive). If so, try again.



