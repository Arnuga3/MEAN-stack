import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../classes/User';
import { AuthResponse } from '../interfaces/IAuth.response';
import { Router } from '@angular/router';
import { JSONP_HOME } from '@angular/http/src/backends/browser_jsonp';

@Injectable()
export class UserService {
  
  // URL to web API
  private apiUrl = 'api';
  private token;
  private httpOptions = {
    headers: new HttpHeaders()
  };
  
  constructor(
    private http: HttpClient,
    private router: Router
   ) {
    // Check if client has token
    if (localStorage.getItem('MLPGameToken') === null) {
      
      sessionStorage.clear()
      this.router.navigateByUrl('/login')
      
    } else {
      // Get token from localStorage
      this.token = localStorage.getItem('MLPGameToken');
      this.httpOptions.headers = this.httpOptions.headers.append('Content-Type', 'application/json');
      // Add token to reqeuest header
      this.httpOptions.headers = this.httpOptions.headers.append('Authorization', this.token);
      // console.log(this.httpOptions.headers);
    }
  }

  // Get user by id
  getUserById(id: string): Observable<User> {
    const url = `${this.apiUrl}/user/${id}`;
    return this.http.get<User>(url, this.httpOptions);
  }

  // Buy style
  buyStyle(id: string, type: string): Observable<User> {
    const url = `${this.apiUrl}/user/${id}/shop/${type}`;
    return this.http.get<User>(url, this.httpOptions);
  }
  
  // Get list of all users
  getUsers(): Observable<User[]> {
    const url = `${this.apiUrl}/users`;    
    return this.http.get<User[]>(url, this.httpOptions);
  }

  // Authenticate user
  loginUser(user: User) {
    console.log(`Login request made: ${JSON.stringify(user)}`)
    const url = `${this.apiUrl}/authenticate`;
    return this.http.post<AuthResponse>(url, {
        username: user.username,
        password: user.password
    }).subscribe(data => {
      console.log(`Login response received: ${JSON.stringify(data)}`);
      // Save the token on client
      if (data.token) {
        this.token = data.token;
        console.log(`Saving token to localStorage: ${JSON.stringify(data.token)}`)
        localStorage.setItem('MLPGameToken', data.token)
        console.log(`Saving user to sessionStorage: ${data.user}`)
        sessionStorage.setItem("MPGameUser", data.user)
        // Navigate to gameport
        this.router.navigateByUrl('/gameport');
      }
    });
  }

  // Logout
  logoutUser(): void {
    this.token = null;
    sessionStorage.clear()
    localStorage.removeItem('MLPGameToken')
    this.router.navigateByUrl('/login')
  }

  // Create user
  addUser(user: User){
    const url = `${this.apiUrl}/users`;
    console.log(`Registration request made to ${url}`)
    console.log(JSON.stringify(user))
    return this.http.post<any>(url, {
      email: user.email,
      username: user.username,
      password: user.password,
      exp: user.exp,
      wins: user.wins,
      games: user.games,
      coins: user.coins,
      shopStyle: user.shopStyle
    }).subscribe(data => {
      console.log(`Response on addUser: ${data.message}`)
      sessionStorage.setItem("MPGameUser", JSON.stringify(data.user))
      console.log(`Response token: ${data.token}`)
      localStorage.setItem('MLPGameToken', JSON.stringify(data.token))
      this.router.navigateByUrl('/login');
    });
  }
}
