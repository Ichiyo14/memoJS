const fs = require('fs')
const stragePath = './strage.json'
const argv = require('minimist')(process.argv.slice(2))
const initialStrageFile = { memos: [] }
if (!fs.existsSync(stragePath)) {
  const jsonDeta = JSON.stringify(initialStrageFile, null, '\t')
  fs.writeFileSync(stragePath, jsonDeta)
}
class Memo {
  constructor (strage) {
    this.strage = strage
    this.memosDeta = strage.memosDeta
  }

  create () {
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
      if ((this.memosOnFirstLines().indexOf(lines[0].trim()) === -1) && (!(lines[0].trim() === ''))) {
        this.memosDeta.memos.push(lines)
        this.strage.write(this.memosDeta)
        console.log('memoを作成しました。')
      } else {
        console.log('1行目が空白かまたは既存のメモと同一です。\n' +
        '1行目の内容を変更して再度入力してください。')
      }
    })
  }

  list () {
    this.memosOnFirstLines().forEach(x => console.log(x))
  }

  reference () {
    const { Select } = require('enquirer')
    const prompt = new Select({
      message: 'Choose a note you want to see:',
      choices: this.memosOnFirstLines()
    })
    prompt.run()
      .then(FistLines => this.printText(this.memosOnFirstLines().indexOf(FistLines)))
      .catch(console.error)
  }

  delete () {
    const { Select } = require('enquirer')
    const prompt = new Select({
      message: 'Choose a note you want to delete:',
      choices: this.memosOnFirstLines()
    })
    prompt.run()
      .then(FistLines => this.deleteMemo(this.memosOnFirstLines().indexOf(FistLines)))
      .then(console.log())
      .catch(console.error)
  }

  memosOnFirstLines () {
    const _memosOnFirstLinesArray = []
    for (const i in this.memosDeta.memos) {
      _memosOnFirstLinesArray.push(this.memosDeta.memos[i][0].replace(/\r?\n/g, ''))
    }
    return _memosOnFirstLinesArray
  }

  printText (memosIndex) {
    console.log(this.memosDeta.memos[memosIndex].join(''))
  }

  deleteMemo (memosIndex) {
    this.memosDeta.memos.splice(memosIndex, 1)
    console.log(this.memosDeta)
    this.strage.write(this.memosDeta)
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
if (!process.stdin.isTTY) memo.create()
if (argv.l) memo.list()
if (argv.r) memo.reference()
if (argv.d) memo.delete()
