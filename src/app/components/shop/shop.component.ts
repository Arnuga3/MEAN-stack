import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../classes/User';
<<<<<<< HEAD
// Shop page
=======

>>>>>>> 533ebbdcd1f0cd2c784269658376967500444a5c
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  user: User
  lvl: number
  options

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
<<<<<<< HEAD
    // Hard coded option in the shop
=======

>>>>>>> 533ebbdcd1f0cd2c784269658376967500444a5c
    this.options = [
      {
        type: 'standard',
        price: 0,
        img: '../../../assets/standard.PNG'
      },
      {
        type: 'metal',
        price: 10,
        img: '../../../assets/metal.PNG'
      },
      {
        type: 'pirate',
        price: 20,
        img: '../../../assets/pirateStyle.PNG'
      }
    ]
<<<<<<< HEAD
    // Get user info from the sessionStorage
=======

>>>>>>> 533ebbdcd1f0cd2c784269658376967500444a5c
    this.user = JSON.parse(sessionStorage.getItem('MPGameUser'))
    this.findPlayerLVL()
  }

  findPlayerLVL() {
    this.lvl = Math.floor(this.user.exp / 100)
  }
<<<<<<< HEAD
  // On purchase button click
=======

>>>>>>> 533ebbdcd1f0cd2c784269658376967500444a5c
  buy(id, type, price) {
    if (this.user.coins < price) {
      alert('Not enough diamonds!')
    } else {
      console.log('check' + id + ':' + type)
<<<<<<< HEAD
      // Update the user info on callback
=======
>>>>>>> 533ebbdcd1f0cd2c784269658376967500444a5c
      this.userService.buyStyle(id, type).subscribe(
        user => this.user = user,
        error => console.log("Error: " + error),
        () => sessionStorage.setItem('MPGameUser', JSON.stringify(this.user))
      )
    }
  }
<<<<<<< HEAD
  // Get user by id
=======

>>>>>>> 533ebbdcd1f0cd2c784269658376967500444a5c
  getUser(id: string) {
    this.userService.getUserById(id).subscribe(
      user => this.user = user,
      error => console.log("Error: " + error)
    )
  }

}
