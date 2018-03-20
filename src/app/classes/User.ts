import { IUser } from './../interfaces/IUser'

export class User implements IUser {
  id: string
  _email: string
  _username: string
  //level: number
  _password: string
  _socket: string

  constructor(id='', email='', username='') {
    this.id = id
    this.email = email
    this._username = username
  }

  set email(email) {
    this._username = email
  }
  get email() {
    return this._email
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