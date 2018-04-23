class Battle {
  constructor (player1, player2) {
    this._players = [player1, player2]
    this._name = ''
    this._state = {}
    // 0 - player1, 1 - player2
    // player1 is an attacker
    this.turn = 0
  }

  getState (player) {
    let attacker
    let defender
    if (this.turn === 0) {
      attacker = this.players[0]
      defender = this.players[1]
    } else {
      attacker = this.players[1]
      defender = this.players[0]
    }

    // Attacker requesting a state
    if (player === attacker.username) {
      // Hide the defender ships for the attacker
      return {
        attacker: attacker.username,
        defender: defender.username
      }
    // Defender requesting a state
    } else {
      return {
        attacker: attacker.username,
        defender: defender.username
      }
    }
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
}
module.exports = Battle
