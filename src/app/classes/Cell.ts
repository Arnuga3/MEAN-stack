export class Cell {
  _state: 'empty'

  get state() {
    return this._state
  }

  set state(x) {
    this._state = x
  }

}
