import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { WebSocketService } from '../../services/websocket.service';
import { Cell } from '../../classes/Cell'

@Component({
  selector: 'app-battle',
  templateUrl: './battlefield.component.html',
  styleUrls: ['./battlefield.component.css']
})

export class BattleFieldComponent implements OnInit {

  public sideSize:number = 8
  public battlefield = new Array(this.sideSize * this.sideSize)
  public battlefieldDisplay = new Array(this.sideSize * this.sideSize)
  public battlefieldSize: number = this.battlefield.length
  public actBatField = []
  public actBatFieldEnemy = new Array(this.sideSize * this.sideSize)
  // For boundary checks - format [cells of all]
  public shipsAll = []
  // For intersection checks - format [ [cells of one],[cells of one],[cells of one] ]
  public shipsArrAll = []
  public canAttack = true

  constructor( private userService: UserService, public WSService: WebSocketService ) { }

  ngOnInit() {
    this.generateRandomShips()
    this.populateBattlefield()
  }

  populateBattlefield () {
    this.battlefield.fill('E', 0, this.battlefieldSize)
    this.actBatFieldEnemy.fill('E', 0, this.battlefieldSize)
    for (let c of this.shipsAll) {
      this.battlefield[c] = 'S'
    }
    this.actBatField = this.battlefield
  }

  // Creates ships
  generateRandomShips() {
    // Removing old ships
    this.shipsAll = []
    this.shipsArrAll = []
    // Generating new ships
    this.saveShip(this.createShip(1))
    this.saveShip(this.createShip(2))
    this.saveShip(this.createShip(3))
    this.saveShip(this.createShip(4))

    this.populateBattlefield()
  }

  // Getting random number in range min-max(excluding)
  _randomNum(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min)
  }

  // Getting random direction
  _randomDirection() {
    let directions: string[] = ['top', 'right', 'bottom', 'left']
    return directions[this._randomNum(0, directions.length)]
  }

  // Generate ship cells starting from random point
  _getNextCells(len) {
    let startPoint = this._randomNum(0, this.battlefieldSize)
    let direction = this._randomDirection()
    var points = []
    points.push(startPoint) // Add first point (cell) of ship
    for (let i=0; i<len-1; i++) {
      // Finding a next point and save it to array
      switch(direction) {
        case 'top':
          let top = points[i] - this.sideSize
          points.push(top)
          break
        case 'right':
          let right = points[i] + 1
          points.push(right)
          break
        case 'bottom':
          let bottom = points[i] + this.sideSize
          points.push(bottom)
          break
        case 'left':
          let left = points[i] - 1
          points.push(left)
          break
        default:
          console.log('default')
      }
    }
    return { points, direction }  // Returning generated ship points and direction
  }

  // Checkin intersection of generated ship with map boundaries
  _areValid(obj) {
    let points = obj.points         // ship points (cells)
    let direction = obj.direction   // rigth/left/top/bottom
    for (let i=0; i<points.length-1; i++) {
      switch(direction) {
        case 'top':
          let top = points[i] - this.sideSize
          if (top >= 0) continue
          else return false
        case 'right':
          let right = points[i] + 1
          if (right % this.sideSize != 0) continue
          else return false
        case 'bottom':
          let bottom = points[i] + this.sideSize
          if (bottom <= this.battlefieldSize) continue
          else return false
        case 'left':
          let left = points[i]
          if (left % this.sideSize != 0) {
            continue
          } else {
            if (i == points.length-1) return true
            else return false
          }
        default:
          console.log('default')
      }
    }
    return true // Returning true if intersection is not detected
  }

  // Checking intersection with points around the main point
  _intersect(point, arr) {
    for (let i=0; i<arr.length; i++) {
      // Corners
      if (point - this.sideSize - 1 == arr[i]) return true  // top left corner of point
      if (point - this.sideSize + 1 == arr[i]) return true  // top right corner of point
      if (point + this.sideSize - 1 == arr[i]) return true  // bottom left corner of point
      if (point + this.sideSize + 1 == arr[i]) return true  // bottom right corner of point
      // Sides
      if (point - this.sideSize == arr[i]) return true      // top of point
      if (point + 1 == arr[i]) return true                  // right of point
      if (point + this.sideSize == arr[i]) return true      // bottom of point
      if (point - 1 == arr[i]) return true                  // left of point
    }
    return false
  }

  // Checking intersection of point with points of previously created ships
  _doNotIntersect(point) {
    // Getting previously created ships saved in shipsArrAll array
    for (let i=0; i<this.shipsArrAll.length; i++) {
      // Checking intersection
      if (this._intersect(point, this.shipsArrAll[i])) return false
    }
    return true                                                                                                                                                                                                                             
  }

  createShip(len: number) {
    let points = this._getNextCells(len)            // Getting just created ship
    if (this._areValid(points)) {                   // Checking boundaries
      for (let i=0; i<points.points.length; i++) {  // Getting last created ship points
        // Checking interssection of all points from last created ship with previously created and saved ships
        if (!this._doNotIntersect(points.points[i])) return this.createShip(len)
      }
      return points.points                          // All conditions are met
    } else return this.createShip(len)              // Running function again until conditions are met (recursion)
  }

  // Saving a ship
  saveShip(ship) {
    // Adding as array - using for ship intersection check
    this.shipsArrAll.push(ship)
    // Adding as numbers to one array - using for boundaries intersection check
    this.shipsAll.push(...ship)
  }

  showGameShip(val) {
    if (this.battlefield[val] === 'S') return true
    else return false
  }

  showGameBoom(val) {
    if (this.battlefield[val] === 'B') return true
    else return false
  }

  showGameNone(val) {
    if (this.battlefield[val] === 'X') return true
    else return false
  }

  // Using this function in view to display ship cells
  showShip(val) {
    return this.shipsAll.includes(val)
  }

  // Send a cell number to attack
  attack(i:number) {
    if (this.canAttack) {
      console.log('ATTACK ' + this.canAttack)
      const battleName = localStorage.getItem('battleRoom')
      this.WSService.sendShot( { battleName, shot: i } )
    }
  }

  // Printing number of cell
  print(i: number) {
    console.log(i)
    // console.log(this.shipsArrAll)
  }
}
