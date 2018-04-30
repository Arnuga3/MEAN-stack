import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../classes/User';
// Shop page
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
    // Hard coded option in the shop
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
    // Get user info from the sessionStorage
    this.user = JSON.parse(sessionStorage.getItem('MPGameUser'))
    this.findPlayerLVL()
  }

  findPlayerLVL() {
    this.lvl = Math.floor(this.user.exp / 100)
  }
  // On purchase button click
  buy(id, type, price) {
    if (this.user.coins < price) {
      alert('Not enough diamonds!')
    } else {
      console.log('check' + id + ':' + type)
      // Update the user info on callback
      this.userService.buyStyle(id, type).subscribe(
        user => this.user = user,
        error => console.log("Error: " + error),
        () => sessionStorage.setItem('MPGameUser', JSON.stringify(this.user))
      )
    }
  }
  // Get user by id
  getUser(id: string) {
    this.userService.getUserById(id).subscribe(
      user => this.user = user,
      error => console.log("Error: " + error)
    )
  }

}
