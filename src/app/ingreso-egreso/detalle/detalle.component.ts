import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReplaySubject, takeUntil } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { appStateIngresoEgreso } from '../store/ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit, OnDestroy {

  private destroyed$ : ReplaySubject<boolean> = new ReplaySubject(1);
  ingresosEgresos: any[]= [];

  constructor(private store: Store<appStateIngresoEgreso>,
              private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.store.select('ingresosEgresos').pipe(takeUntil(this.destroyed$))
    .subscribe({
      next:({items})=>{ this.ingresosEgresos = items}})
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

  borrar(uid:string){
    this.ingresoEgresoService.borrarIngresoEgreso(uid).then(()=> Swal.fire('Borrado','Item borrado','success'))
    .catch(()=>Swal.fire('Borrado','Item borrado','success'))
  }

}
