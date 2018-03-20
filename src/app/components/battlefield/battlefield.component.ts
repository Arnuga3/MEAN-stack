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

  public sideSize:number = 10
  public battlefield: number[] = new Array(this.sideSize * this.sideSize)
  public battlefieldSize: number = this.battlefield.length
  public selectedCell: number = 0
  // For boundary checks - format [cells of all]
  public shipsAll = []
  // For intersection checks - format [ [cells of one],[cells of one],[cells of one] ]
  public shipsArrAll = []

  constructor( private userService: UserService, public WSService: WebSocketService ) { }

  ngOnInit() {
    this.generateRandomShips()
  }

  generateRandomShips() {
    // Removing old ships
    this.shipsAll = []
    this.shipsArrAll = []
    // Generating new ships
    this.saveShip(this.createShip(1))
    this.saveShip(this.createShip(2))
    this.saveShip(this.createShip(3))
    this.saveShip(this.createShip(4))

    // if intersect
  }

  // Generating random number in range min-max(excluding)
  _randomNum(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min)
  }
  // Getting random direction, accepting an array of directions need to be excluded
  _randomDirection() {
    let directions: string[] = ['top', 'right', 'bottom', 'left']
    return directions[this._randomNum(0, directions.length)]
  }
  // Generate ship cells starting from random point
  _getNextCells(len) {
    let startPoint = this._randomNum(0, this.battlefieldSize)
    let direction = this._randomDirection()
    var points = []
    points.push(startPoint)
    console.log(`Starting point ${startPoint}`)
    for (let i=0; i<len-1; i++) {
      switch(direction) {
        case 'top':
          let top = points[i] - this.sideSize
          // console.log(`top: ${top}`)
          points.push(top)
          break
        case 'right':
          let right = points[i] + 1
          // console.log(`right: ${right}`)
          points.push(right)
          break
        case 'bottom':
          let bottom = points[i] + this.sideSize
          // console.log(`bottom: ${bottom}`)
          points.push(bottom)
          break
        case 'left':
          let left = points[i] - 1
          // console.log(`left: ${left}`)
          points.push(left)
          break
        default:
          console.log('default')
      }
    }
    console.log(points)
    return { points, direction }
  }
  // Validating the generated ship cells (boundaries of the battlefield)
  _areValid(obj) {
    let points = obj.points
    let direction = obj.direction
    let startPoint = points[0]
    console.log(`Starting point - validation: ${startPoint}`)
    for (let i=0; i<points.length-1; i++) {
      switch(direction) {
        case 'top':
          let top = points[i] - this.sideSize
          // console.log(`top: ${top}`)
          if (top >= 0) continue
          else return false
        case 'right':
          let right = points[i] + 1
          // console.log(`right: ${right}`)
          if (right % this.sideSize != 0) continue
          else return false
        case 'bottom':
          let bottom = points[i] + this.sideSize
          // console.log(`bottom: ${bottom}`)
          if (bottom <= this.battlefieldSize) continue
          else return false
        case 'left':
          let left = points[i]
          // console.log(`left: ${left}`)
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
    console.log(points)
    return true
  }

  _intersect(point, arr) {
    console.log(`_intersect - point: ${point}`)
    console.log(`_intersect - arr[i]: ${arr}`)
    for (let i=0; i<arr.length; i++) {
      // Corners
      // top left corner of point
      if (point - this.sideSize - 1 == arr[i]) return true
      // top right corner of point
      if (point - this.sideSize + 1 == arr[i]) return true
      // bottom left corner of point
      if (point + this.sideSize - 1 == arr[i]) return true
      // bottom right corner of point
      if (point + this.sideSize + 1 == arr[i]) return true
      // Sides
      // top of point
      if (point - this.sideSize == arr[i]) return true
      // right of point
      if (point + 1 == arr[i]) return true
      // bottom of point
      if (point + this.sideSize == arr[i]) return true
      // left of point
      if (point - 1 == arr[i]) return true
    }
    console.log(`_intersect - false`)
    return false
  }

  _doNotIntersect(point) {
    // Getting created ship arrays
    for (let i=0; i<this.shipsArrAll.length; i++) {
      // Checking if point is intersecting with points of created ships
      if (this._intersect(point, this.shipsArrAll[i])) return false
    }
    console.log(`_doNotIntersect - true`)
    return true                                                                                                                                                                                                                             
  }

  createShip(len: number) {
    // Getting random ship
    let points = this._getNextCells(len)
    // Checking boundaries
    if (this._areValid(points)) {
      console.log(`intersection - Getting random ship points`)
      // Getting random ship points
      for (let i=0; i<points.points.length; i++) {
        // Checking point intersection with points of created ships
        if (!this._doNotIntersect(points.points[i])) return this.createShip(len)
      }
      return points.points
    }
    // Running function again until conditions are met (recursion)
    else return this.createShip(len)
  }

  // Saving a ship to array for all ships
  saveShip(ship) {
    console.log(`SHIP TO SAVE ${ship}`)
    this.shipsArrAll.push(ship)
    this.shipsAll.push(...ship)
  }

  // Using this function in view to display ship cells
  showShip(val) {
    return this.shipsAll.includes(val)
  }

  // Printing the number of the cell
  print(i: number) {
    console.log(i)
  }
}
