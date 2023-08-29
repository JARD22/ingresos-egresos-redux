import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReplaySubject, takeUntil } from 'rxjs';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { appStateIngresoEgreso } from '../store/ingreso-egreso.reducer';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styleUrls: ['./estadistica.component.css']
})
export class EstadisticaComponent implements OnInit,OnDestroy {

  private destroyed$ : ReplaySubject<boolean> = new ReplaySubject(1); 
  ingresos: number = 0;
  egresos: number = 0;

  totalIngresos: number = 0;
  totalEgresos: number = 0;

  constructor(private store: Store<appStateIngresoEgreso>) { }

  ngOnInit(): void {
    this.store.select('ingresosEgresos').pipe(takeUntil(this.destroyed$))
    .subscribe({
      next:({items})=>{
        this.generarEstadistica(items);
      }
    })
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

  generarEstadistica(items: IngresoEgreso[]){
      for (const item of items) {
          if (item.tipo ==='ingreso') {
            this.totalIngresos += item.monto;
            this.ingresos++;
          }else{
            this.totalEgresos += item.monto;
            this.ingresos++;
          }
      }
  }

}
