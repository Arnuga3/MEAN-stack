import { IUser } from './../interfaces/IUser'
// User class
export class User implements IUser {
  _id: string
  _email: string
  _username: string
  //level: number
  _password: string
  _exp: number
  _wins: number
  _games: number
  _coins: number
  _shopStyle: string

  constructor(id='', email='', username='', exp=0, wins=0, games=0, coins=0, shopStyle='') {
    this._id = id
    this.email = email
    this._username = username
    this._exp = exp
    this._wins = wins
    this._games = games
    this._coins = coins
    this._shopStyle = shopStyle
  }

  set id(id) {
    this._id = id
  }
  get id() {
    return this._id
  }

  set email(email) {
    this._email = email
  }
  get email() {
    return this._email
  }

  set exp(exp) {
    this._exp = exp
  }
  get exp() {
    return this._exp
  }

  set wins(wins) {
    this._wins = wins
  }
  get wins() {
    return this._wins
  }

  set games(games) {
    this._games = games
  }
  get games() {
    return this._games
  }

  set coins(coins) {
    this._coins = coins
  }
  get coins() {
    return this._coins
  }

  set shopStyle(shopStyle) {
    this._shopStyle = shopStyle
  }
  get shopStyle() {
    return this._shopStyle
  }

  set username(username) {
    this._username = username
  }
  get username() {
    return this._username
  }

  set password(password) {
    this._password = password
  }
  get password() {
    return this._password
  }
}