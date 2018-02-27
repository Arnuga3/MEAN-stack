import { Component, OnInit } from '@angular/core';
import { Register } from './Register';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  register: Register = {
    email: '',
    username: '',
    passport: ''
  }

  constructor() { }

  ngOnInit() {
  }

}
