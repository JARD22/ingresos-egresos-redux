import { createReducer, on } from '@ngrx/store';
import { setItems,unSetItems } from './ingreso-egreso.actions';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { AppState } from 'src/app/app.reducer';

export interface State {
    items: IngresoEgreso[]; 
}

export interface appStateIngresoEgreso extends AppState{
    ingresosEgresos: State
}

export const initialState: State = {
   items: [],
}

export const _ingresoEgresoReducer = createReducer(initialState,

    on(setItems, (state,{items}) => ({ ...state, items: [...items]})),
    on(unSetItems,state =>({...state,items:[]})),

);
