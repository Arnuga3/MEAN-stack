import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from './User';
import { AuthResponse } from './authResponse';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'token'
  })
};

@Injectable()
export class UserService {
  
  // Url to web API
  private apiUrl = 'api';
  
  constructor( 
    private http: HttpClient
  ) {}
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, httpOptions)
  }

  loginUser(user: User) {
    console.log('login request made')
    // console.log(user.username)
    // console.log(user.password)
    const url = `${this.apiUrl}/authenticate`;
    return this.http.post<AuthResponse>(url, {
        username: user.username,
        password: user.password
    }).subscribe(data => {
      // Save the token on a client
      console.log(data.token);
    });
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user)
  }

}
