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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy  {

  public loginForm!: FormGroup;
  cargando : boolean = false;
  uiSubscriptions!: Subscription;

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

   this.uiSubscriptions = this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading)
  }

  ngOnDestroy(): void {
      this.uiSubscriptions.unsubscribe();
  }


  login() {
    if (this.loginForm.valid) {

      this.store.dispatch(isLoading())


      // Swal.fire({
      //   title: 'Espere porfavor',
      //   didOpen: () => {
      //     Swal.showLoading()

      //   }
      // });

      const { email, password } = this.loginForm.value;
      this.authService.login(email, password)
        .then(credentials => {
              // Swal.close();

              this.store.dispatch(stopLoading())
          this.router.navigate(['/']);
    })
        .catch (err => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message
      })
    })
  }
}

}
