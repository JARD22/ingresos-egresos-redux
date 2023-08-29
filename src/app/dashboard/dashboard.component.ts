import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ReplaySubject, filter, takeUntil } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ingresoEgresoActions  from '../ingreso-egreso/store/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit,OnDestroy {

  private destroyed$ : ReplaySubject<boolean>  = new ReplaySubject(1);

  constructor(private store:Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.store.select('user').pipe(takeUntil(this.destroyed$),
    filter(auth=>auth.user != null))
    .subscribe({
      next:({user})=>{
        this.setItems(user?.uid);
      }
    })
  }


  setItems(uid:string){
  this.ingresoEgresoService.initIngresosEgresosListener(uid).pipe(takeUntil(this.destroyed$))
  .subscribe({
    next:(items)=>{
      this.store.dispatch(ingresoEgresoActions.setItems({items}))
    }
  })
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.subscribe();
  }
}
