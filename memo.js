const fs = require('fs')
const stragePath = './strage.json'
const argv = require('minimist')(process.argv.slice(2))

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
      input: process.stdin
    })
    reader.on('line', (line) => {
      lines.push(line + '\n')
    })
    reader.on('close', () => {
      lines.splice(-1, 1, lines[lines.length - 1].trim())
      this.memosDeta.memos.push(lines)
      this.strage.write(this.memosDeta)
    })
  }

  list () {
    this._memosOnFirstLines().map(x => console.log(x))
  }

  reference () {
  }

  _memosOnFirstLines () {
    const _memosOnFirstLinesArray = []
    for (const i in this.memosDeta.memos) {
      _memosOnFirstLinesArray.push(this.memosDeta.memos[i][0].replace(/\r?\n/g, ''))
    }
    return _memosOnFirstLinesArray
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
if (argv.l) memo.list()
