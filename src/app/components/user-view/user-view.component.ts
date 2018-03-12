import { Component, OnInit } from '@angular/core';
import { UserService } from './../../services/user.service';
import { IUser } from './../../interfaces/IUser';
import { User } from './../../User';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {

  user: IUser
  selectedCell: number
  arr: Array<number>
  numCells: number

  constructor( private userService: UserService ) { 
    this.user = new User();
    this.selectedCell = 0
  }

  ngOnInit() {
    this.getUserById();
  }
  
  getUserById() {
    let userId = sessionStorage.getItem('userId');
    //console.log(userId)
    this.userService.getUserById(userId).subscribe(
      user => this.user = user,
      error => console.log("Error: " + error)
    )
  }

}
