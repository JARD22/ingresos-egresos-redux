import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ReplaySubject, takeUntil } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  private destroy$ : ReplaySubject<boolean> = new ReplaySubject(1);
  nombre: string | undefined ='';

  constructor(private authService: AuthService,
              private router: Router,
              private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.select('user').pipe(takeUntil(this.destroy$))
    .subscribe({
      next:({user})=>{
        this.nombre = user?.nombre
      }
    })
  }

  ngOnDestroy(): void {
      this.destroy$.next(true);
      this.destroy$.unsubscribe();
  }

  logout(){
    this.authService.logout().then(logout =>{
      this.router.navigate(['/login']);
    })
  }

}
