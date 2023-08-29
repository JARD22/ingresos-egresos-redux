import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router,  UrlTree } from '@angular/router';
import { Observable, take, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService,
              private router : Router){
    
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isAuth()
    .pipe(
      tap( state =>{
        if (!state) { this.router.navigate(['/login'])}
      }),
      take(1)
    )
  }
  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isAuth()
    .pipe(
      tap( state =>{
        if (!state) { this.router.navigate(['/login'])}
      })
    )
  }
  
}
