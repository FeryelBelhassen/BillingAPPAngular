import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Useer } from '../domain/useer';

const AUTH_API = 'http://localhost:8080/api/auth/';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private userSubject: BehaviorSubject<Useer>;
  public user: Observable<Useer>;
  private refreshTokenTimeout: any;

  constructor(private router: Router, private http: HttpClient, public jwtHelper: JwtHelperService) {
    this.userSubject = new BehaviorSubject<Useer>(null!);
    this.user = this.userSubject?.asObservable();
   }
  
   public set userValue(user: Useer){
    if (user.username){
      this.userValue.username = user.username;
    } if (user.password) {
      this.userValue.password = user.password;
    } if (user.jwtToken) {
      this.userValue.jwtToken = user.jwtToken;
    } if (user.refreshToken) {
      this.userValue.refreshToken = user.refreshToken;
    }

  }
  public get userValue(): Useer {
    return this.userSubject.value;
  }
 
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }
  get isLoggedIn() {
    return true;
  }


 login(username: string, password: string){
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/json');
  
        let toSend = {
          'username': username,
          'password': password
        }
    return this.http.post<any>(AUTH_API+"signin", toSend, {headers}) 
    .pipe( map( data => {
      this.userSubject.next(new Useer(username, data['accessToken'] ))
      this.userValue.refreshToken = data['refreshToken'];
      this.startRefreshTokenTimer()      
    }))
  

  }
  
  register(username: string, email: string, password: string, role: {id: number, name: string }[]): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        username,
        email,
        password,
        role
      }
    );
  }

 
  getToken(){
    return localStorage.getItem('token');
  }
  
 
  logout(){
    this.userSubject.unsubscribe;
  }

  refreshToken(token:any) {
    // the expired token must be included in the Authorization header and the refresh in the body ?
    return this.http.get<any>(AUTH_API +'refreshtoken' )
        .pipe(map((data) => {
          console.log(data);
    }));
  }
    private startRefreshTokenTimer() {
      const jwtToken = JSON.parse(atob(this.userValue?.jwtToken!.split('.')[1]));
      const expires = new Date(jwtToken.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (60 * 1000);
      this.refreshTokenTimeout = setTimeout(() => this.refreshToken(this.userValue.refreshToken).subscribe(), timeout);
    
    }
    
    private stopRefreshTokenTimer() {
      clearTimeout(this.refreshTokenTimeout);
    }
    
}

// helper methods



