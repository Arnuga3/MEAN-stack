import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../classes/User';
// Scoreboard page
@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {
  // Array of users, displayed in view in a table
  users: User[]
  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    // Get user on load
    this.getUsers()
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      users => this.users = users,
      error => console.log("Error: " + error)
    )
  }
}
