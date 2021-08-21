const fs = require('fs')
const stragePath = './strage.json'

if (!fs.existsSync(stragePath)) {
  console.log('jsonファイルを作成する')
} else {
  console.log('ok')
}
class Memo {
  constructor (strage) {
    this.strage = strage
    this.memosDeta = strage.memosDeta
  }

  add () {
    process.stdin.setEncoding('utf8')
    const lines = []
    const reader = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })
    reader.on('line', (line) => {
      lines.push(line + '\n')
    })
    reader.on('close', () => {
      lines.splice(-1, 1, lines[lines.length - 1].trim())
      console.log(this.memosDeta)
      console.log(lines)
      this.memosDeta.memos.push(lines)
      console.log(this.memosDeta)
      this.strage.write(this.memosDeta)
    })
  }
}

class Strage {
  constructor (path) {
    this.memosDeta = JSON.parse(fs.readFileSync(path, 'utf-8'))
    this.path = path
  }

  write (memoArray) {
    const jsonDeta = JSON.stringify(memoArray, null, '\t')
    fs.writeFileSync(this.path, jsonDeta)
  }
}
const strage = new Strage(stragePath)
const memo = new Memo(strage)
if (!process.stdin.isTTY) { memo.add() }
