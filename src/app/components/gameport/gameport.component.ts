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
  // To display/ hide elements on a page depending on the game state
  gameIsOn = false
  waiting = false
  // To hold a state message of the game
  gameStateMsg = ''
  lvl = 0

  constructor(
    // Services
    private userService: UserService,
    private WSService: WebSocketService,
    // Router
    private router: Router ) { }

  ngOnInit() {
    
    let user = sessionStorage.getItem('MPGameUser')
    this.player = JSON.parse(user)
    // Register a user in a websocket
    this.setPlayerCon()
    // Chat messages
    this.chatMsgs = []
    this.onlineUsersNum = 0
    this.getOnlineUsers()
    // Calc user lvl from the experience
    this.findPlayerLVL()

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
      // Game is finished
      if (msg.message === 'Battle is finished.') {
        alert('Game is over!')
        // Delay
        setTimeout( () => { 
          this.gameIsOn = false
          this.gameStateMsg = ''
          this.battlefield.reset()
          // Update user info on the client
          this.userService.getUserById(this.player.id).subscribe(
            user => this.player = user,
            error => console.log("Error: " + error),
            () => sessionStorage.setItem('MPGameUser', JSON.stringify(this.player)))
        }, 1500 )
      }
      // Scroll to bottom to see a new message
      this.scrollChatBox()
    })
    // Response on finish of player setup in the websocket
    this.WSService.onPlayerCon().subscribe(msg => {
      this.chatMsgs.push(this.createChatMsg(msg.message))
      console.log(msg.message)
      this.scrollChatBox()
    })
    this.WSService.onUsersOnline().subscribe(msg => {
      this.onlineUsersNum = +msg.message
      console.log(msg.message)
    })
    // Game start response form ws
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
        this.gameStateMsg = 'Your turn!'
      // For defender
      } else {
        this.battlefield.canAttack = false
        this.battlefield.battlefield = this.battlefield.actBatField
        this.gameStateMsg = 'Wait for your turn!'
      }
      this.waiting = false
      this.gameIsOn = true
    })
    // Game state response from ws
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
         this.gameStateMsg = 'Your turn!'
        }, 1500 )
      // for defender
      } else {
        this.battlefield.actBatFieldEnemy[+attackResult.cell] = attackResult.symbol
        this.battlefield.canAttack = false
        setTimeout( () => { 
          this.battlefield.battlefield = this.battlefield.actBatField
          this.gameStateMsg = 'Wait for your turn!'
        }, 1500 )
      }
    })
  }
  // Calc user lvl
  findPlayerLVL() {
    this.lvl = Math.floor(this.player.exp / 100)
  }
  // Navigate to scoreboard
  goToScoreborad() {
    this.router.navigateByUrl('/scoreboard')
  }
  // Navigate to shop
  goToShop() {
    this.router.navigateByUrl('/shop')
  }
  // Scroll the chat window to bottom
  scrollChatBox() {
    var chatBox = document.querySelector('.chat');
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  // Create a specific format for the chat message with time
  createChatMsg(msg) {
    let date = new Date()
    let h = date.getHours() <= 9 ? '0' + date.getHours() : date.getHours()
    let m = date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes()
    return `${h}:${m} ${msg}`
  }
  // Create a new set of ships trigger used on button in view
  generateRandomShips() {
    this.battlefield.generateRandomShips()
  }

  ///
  // REQUESTS TO WEBSOCKET SERVICE
  ///
  sendStartRequest() {
    // Send id, username and ships to websocket - trigger on button on view
    let battlefield = this.battlefield.battlefield
    let player = {
      id: this.player.id,
      username: this.player.username,
      ships: battlefield
    }
    console.log('Check ' + JSON.stringify(this.player.id))
    this.WSService.sendGameRequest(player)
    this.waiting = true
  }
  // Request to set a player on websockets
  setPlayerCon() {
    console.log('Setting player in ws request made')
    this.WSService.setPlayerCon(this.player.username)
  }

  sendMessage() {
    this.WSService.sendMessage();
  }
  // Gets a number of users from websocket
  getOnlineUsers() {
    this.WSService.getUsersOnline();
  }

  ///
  // REQUESTS TO USER SERVICE
  ///
  // Get all users
  getUsers() {
    this.userService.getUsers().subscribe(
      users => this.users = users,
      error => console.log("Error: " + error)
    )
  }
}
