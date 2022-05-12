
const Nid = require('..')


let i = 0

while(true) {
  Nid()
  if(0 == i % 1000000) {
    console.log(process.memoryUsage())
  }
  i++
}
