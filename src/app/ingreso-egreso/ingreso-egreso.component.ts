import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ReplaySubject, takeUntil } from 'rxjs';
import * as ui from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styleUrls: ['./ingreso-egreso.component.css']
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm!: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  private destroyed$ : ReplaySubject<boolean> = new ReplaySubject(1);


  constructor(private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>) { }

  ngOnInit(): void {

    this.store.select('ui').pipe(takeUntil(this.destroyed$))
    .subscribe({
      next:({isLoading})=>{
        this.cargando = isLoading;
      }
    });

    this.ingresoForm = this.fb.group({
      descripcion: ['', [Validators.required]],
      monto: ['', [Validators.required]],
    });
  }

  ngOnDestroy(){
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

  guardar() {

    this.store.dispatch(ui.isLoading())

    if (this.ingresoForm.invalid) { return; }
    console.log(this.ingresoForm.value);
    console.log(this.tipo);

    const { descripcion, monto } = this.ingresoForm.value;

    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then((ref) => {
        this.ingresoForm.reset();
     this.store.dispatch(ui.stopLoading());
        Swal.fire('Registro creado',descripcion,'success');
      })
      .catch(err => {
     this.store.dispatch(ui.stopLoading());
        Swal.fire('Error',err.message,'error');
      })

  }



}
