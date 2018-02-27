import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
  
  // Url to web API
  private userUrl = 'api/users';

  constructor(
    private http: HttpClient
  ) { }
  

}
