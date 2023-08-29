import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import { setUser, unSetUser } from '../auth/auth.actions';
import { Usuario } from '../models/usuario.model';
import { unSetItems } from '../ingreso-egreso/store/ingreso-egreso.actions';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  authSuscription! : Subscription;
  private _user! : Usuario | null;


  get user(){
    return this._user;
  }

  constructor(public auth: AngularFireAuth,
              private firestore: AngularFirestore,
              private store: Store<AppState>
              ) { }


  initAuthListener(){
    this.auth.authState.subscribe(fuser=>{

      if (fuser) {

       this.authSuscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
        .subscribe( (fireStoreUser:any) => { 

          const user = Usuario.fromFirebase(fireStoreUser);
          this._user = user;
          this.store.dispatch(setUser({user}));
          
        })
        
      }else{
        this._user = null;
        this.authSuscription?.unsubscribe();
        this.store.dispatch(unSetUser());
        this.store.dispatch(unSetItems());

      }

      
      
    });
  }

  crearUsuario(nombre: string, email: string, password:string){

    return  this.auth.createUserWithEmailAndPassword(email,password)
              .then(({user}) =>{

                  const newUser = new Usuario(user?.uid, nombre, email);
                  this.firestore.doc(`${user?.uid}/usuario`).set( {...newUser});
              })
  
  }

  login(email : string, password: string){
    return this.auth.signInWithEmailAndPassword(email,password);
  }

  logout(){
   return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map(fuser => fuser != null )
    )
  }

  
}
