class Battle {
  constructor (player1, player2) {
    this._players = [player1, player2]
    this._name = ''
    // 0 - player1, 1 - player2
    // player1 is an attacker
    this._state = 0
  }

  // Getters/Setters
  get players () {
    return this._players
  }
  set name (name) {
    this._name = name
  }
  get name () {
    return this._name
  }
  set state (state) {
    this._state = state
  }
  get state () {
    return this._state
  }
}
module.exports = Battle
