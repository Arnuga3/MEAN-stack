import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import * as socketIO from 'socket.io-client';

export interface Action {
  user: string,
  action: string
}

var url = 'ws://localhost:8080';

@Injectable()
export class WebSocketService {
  private socket: socketIO.Socket;

  constructor() { 
    this.socket = socketIO('http://localhost:8080');
  }

  sendMessage(msg: string) {
    this.socket.emit('clientMessage', { message: msg });
  }

  onNewMessage() {
    return Observable.create(observer => {
      this.socket.on('newMessage', msg => {
        observer.next(msg);
      });
    });
  }
}
