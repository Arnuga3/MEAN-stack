import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { WebSocketService } from '../../services/websocket.service';
import { User } from '../../classes/User';
import { BattleFieldComponent } from '../battlefield/battlefield.component';

@Component({
  selector: 'app-gameport',
  templateUrl: './gameport.component.html',
  styleUrls: ['./gameport.component.css']
})
export class GamePortComponent implements OnInit {
  @ViewChild(BattleFieldComponent) battlefield;
  users: User[]
  player: User
  chatMsgs: String[]
  onlineUsersNum: number

  constructor( 
    private userService: UserService,
    private WSService: WebSocketService,
    private router: Router ) { }

  ngOnInit() {
    
    let user = sessionStorage.getItem('MPGameUser')
    this.player = JSON.parse(user)
    this.setPlayerCon()
    this.chatMsgs = []
    this.onlineUsersNum = 0
    this.getOnlineUsers()

    ///
    // RESPONSES FROM WEBSOCKET
    ///
    console.log('Subscribing to sockets responses')
    this.WSService.onNotification().subscribe(msg => {
      this.chatMsgs.push(this.createChatMsg(msg.message))
      console.log(`Notification: ${msg.message}`);
      this.scrollChatBox()
    })
    this.WSService.onNewMessage().subscribe(msg => {
      this.chatMsgs.push(this.createChatMsg(msg.message))
      console.log(`Message received: ${msg.message}`);
      this.scrollChatBox()
    })
    this.WSService.onPlayerCon().subscribe(msg => {
      this.chatMsgs.push(this.createChatMsg(msg.message))
      console.log(msg.message)
      this.scrollChatBox()
    })
    this.WSService.onUsersOnline().subscribe(msg => {
      this.onlineUsersNum = +msg.message
      console.log(msg.message)
    })
    this.WSService.onBattleStarted().subscribe(msg => {
      console.log(msg.message)
      // Saving a battle name to LocalStorage
      localStorage.setItem('battleRoom', msg.message.battleName)
      localStorage.setItem('playerIdx', msg.message.playerIdx)
      let state = msg.message.state
      let playerIdx = msg.message.playerIdx
      // Is an attacker
      if (playerIdx === state) {
        this.battlefield.canAttack = true
        this.battlefield.battlefield = this.battlefield.actBatFieldEnemy
      } else {
        this.battlefield.canAttack = false
        this.battlefield.battlefield = this.battlefield.actBatField
      }
    })
    this.WSService.onGameState().subscribe(msg => {
      console.log(msg.message)
      let attackResult = msg.message.attackResult
      let state = msg.message.state
      let playerIdx = msg.message.playerIdx
      // Is an attacker
      if (playerIdx === state) {
        this.battlefield.actBatField[+attackResult.cell] = attackResult.symbol
        this.battlefield.canAttack = true
        setTimeout( () => { 
         this.battlefield.battlefield = this.battlefield.actBatFieldEnemy
        }, 1500 )
      } else {
        this.battlefield.actBatFieldEnemy[+attackResult.cell] = attackResult.symbol
        this.battlefield.canAttack = false
        setTimeout( () => { 
          this.battlefield.battlefield = this.battlefield.actBatField
        }, 1500 )
      }
    })
  }

  scrollChatBox() {
    var chatBox = document.querySelector('.chat');
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  createChatMsg(msg) {
    let date = new Date()
    let h = date.getHours() <= 9 ? '0' + date.getHours() : date.getHours()
    let m = date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes()
    return `${h}:${m} ${msg}`
  }

  generateRandomShips() {
    this.battlefield.generateRandomShips()
  }

  ///
  // REQUESTS TO WEBSOCKET SERVICE
  ///
  sendStartRequest() {
    let battlefield = this.battlefield.battlefield
    let player = {
      username: this.player.username,
      ships: battlefield
    }
    this.WSService.sendGameRequest(player)
  }

  setPlayerCon() {
    console.log('Setting player in ws request made')
    this.WSService.setPlayerCon(this.player.username)
  }

  sendMessage() {
    this.WSService.sendMessage();
  }

  getOnlineUsers() {
    this.WSService.getUsersOnline();
  }

  ///
  // REQUESTS TO USER SERVICE
  ///
  getUsers() {
    this.userService.getUsers().subscribe(
      users => this.users = users,
      error => console.log("Error: " + error)
    )
  }
}
