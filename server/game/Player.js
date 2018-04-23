class Player {
  constructor (data) {
    this._username = data.username
    this._ships = data.ships
    this._battleField = new Array(64)
    this.createBattleField()
    this.toString()
  }
  createBattleField () {
    let ships = this._ships
    let battleField = this._battleField
    battleField.fill('X', 0, 64)
    for (let i in battleField) {
      for (let j of ships) {
        if (+i === +j) battleField[+i] = 'O'
      }
    }
    this._battleField = battleField
    console.log('player :' + JSON.stringify(battleField))
  }
  toString () {
    let field = ''
    for (let i in this._battleField) {
      field += ` ${this._battleField[i]} `
    }
    console.log('player: ' + field)
  }
  get username () {
    return this._username
  }
  get field () {
    return this._battleField
  }
}
module.exports = Player
