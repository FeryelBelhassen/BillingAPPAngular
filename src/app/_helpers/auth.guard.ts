import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'knockout';

//import auth service
import { AuthService } from '../demo/services/auth.service';

@Injectable({
	providedIn:'root'
})
export class AuthGuard implements CanActivate {

	loggedInStatus : boolean = false;

	constructor(private authService : AuthService, private router: Router) { }
  
	//@ts-ignore
  /*	canActivate(_next: ActivatedRouteSnapshot,
	state: RouterStateSnapshot){
		
	Observable<boolean> | Promise<boolean> | boolean {
		if(this.authService.loggenIn$.getValue()){
			console.log("here")
			this.router.navigate(['auth/register']) ;
		}
		return true;
  }*/

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['auth/login']);
      return false;
    }
    return true;
  }
}

