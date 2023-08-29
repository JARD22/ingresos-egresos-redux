import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import { isLoading, stopLoading } from 'src/app/shared/ui.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm! : FormGroup
  uiSubscriptions!: Subscription;
  cargando : boolean = false;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private store: Store<AppState>) { }

  ngOnInit(): void {

    this.registroForm = this.fb.group({
      nombre:['',[Validators.required]],
      correo:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]]
    });

    this.uiSubscriptions  = this.store.select('ui').subscribe(ui=> this.cargando = ui.isLoading);

  }
  ngOnDestroy(): void { 
    this.uiSubscriptions.unsubscribe();
    
  }

  crearUsuario(){
    if (this.registroForm.valid) {

      this.store.dispatch(isLoading());

      const {nombre, correo, password} = this.registroForm.value;
      this.authService.crearUsuario(nombre, correo, password)
      .then( (credentials)=>{
        this.store.dispatch(stopLoading());
        this.router.navigate(['/']);
      }
      )
      .catch(
        err => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message
          })
        }
      )
    }

    
  }

}
