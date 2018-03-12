import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { IUser } from './../interfaces/IUser';
import { AuthResponse } from './../interfaces/IAuth.response';
import { Router } from '@angular/router';

@Injectable()
export class UserService {
  
  // Url to web API
  private apiUrl = 'api';
  private token;
  private httpOptions = {
    headers: new HttpHeaders()
  };
  
  constructor(
    private http: HttpClient,
    private router: Router
   ) {
    // Get token from localStorage
    var token = JSON.parse(localStorage.getItem('MLPGameToken'));
    this.httpOptions.headers = this.httpOptions.headers.append('Content-Type', 'application/json');
    // Add token to reqeuest header
    this.httpOptions.headers = this.httpOptions.headers.append('Authorization', token);
    //console.log(this.httpOptions.headers);
  }

  // Get a user by id
  getUserById(id: string): Observable<IUser> {
    const url = `${this.apiUrl}/user/${id}`;
    return this.http.get<IUser>(url, this.httpOptions);
  }
  
  // Get a list of all users
  getUsers(): Observable<IUser[]> {
    const url = `${this.apiUrl}/users`;    
    return this.http.get<IUser[]>(url, this.httpOptions);
  }

  // Login request to get a token
  loginUser(user: IUser) {
    console.log('login request made')
    // console.log(user.username)
    // console.log(user.password)
    const url = `${this.apiUrl}/authenticate`;
    return this.http.post<AuthResponse>(url, {
        username: user.username,
        password: user.password
    }).subscribe(data => {
      // Save the token on a client
      if (data.token) {
        this.token = data.token;
        localStorage.setItem('MLPGameToken', JSON.stringify(data.token));
        sessionStorage.setItem("userId", data.userId);
        this.router.navigateByUrl('/game');
      }
      //console.log(data.token);
    });
  }

  logoutUser(): void {
    this.token = null;
    localStorage.removeItem('MLPGameToken');
  }

  addUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.apiUrl, user);
  }

}
