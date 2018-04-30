import { Injectable, OnInit } from '@angular/core'
import { Observable, Subject } from 'rxjs/Rx'
import * as socketIO from 'socket.io-client'

// ws url
var url = 'ws://localhost:8080'

@Injectable()
export class WebSocketService {
  private socket: socketIO.Socket

  constructor() { 
    this.socket = socketIO('http://localhost:8080/')
  }

  ///
  // WS REQUESTS
  ///

  // Send private message
  sendMessage() {
    this.socket.emit('privateMessage', { message: { to: 'ad', from: 'as'} })
  }

  // Send battleName and a cell number to attack
  sendShot(n) {
    this.socket.emit('attack', n)
  }

  // Set player in ws
  setPlayerCon(username: string) {
    this.socket.emit('setPlayer', { username });
  }
  // Get a number of online users
  getUsersOnline() {
    this.socket.emit('getUsersOnline');
  }
  // Game request to websocket
  sendGameRequest(player) {
    this.socket.emit('gameRequest', { player })
  }


  ///
  // WS RESPONSES
  ///

  // Inform user connection/ reconnection
  onPlayerCon() {
    return Observable.create(observer => {
      this.socket.on('onSetPlayer', msg => {
        observer.next(msg);
      });
    });
  }

  // Receive private messages
  onNewMessage() {
    return Observable.create(observer => {
      this.socket.on('newMessage', msg => {
        observer.next(msg);
      });
    });
  }

  // Notify who joins the game
  onNotification() {
    return Observable.create(observer => {
      this.socket.on('notification', msg => {
        observer.next(msg);
      });
    });
  }
  // Notify about the number of users online
  onUsersOnline() {
    return Observable.create(observer => {
      this.socket.on('usersOnline', msg => {
        observer.next(msg);
      });
    });
  }
  // Notify when battle started
  onBattleStarted() {
    return Observable.create(observer => {
      this.socket.on('battleStarted', msg => {
        observer.next(msg);
      });
    });
  }
  // Notify on game state change
  onGameState() {
    return Observable.create(observer => {
      this.socket.on('gameState', msg => {
        observer.next(msg);
      });
    });
  }

}
