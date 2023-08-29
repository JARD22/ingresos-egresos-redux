import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from '../services/auth.guard';
import { DashboardComponent } from './dashboard.component';
import { dashboardRoutes } from './dashboard.routes';
import { AuthGuard } from '../services/auth.guard';

const childrenRoutes : Routes =[
  {
    path:'',
    component:DashboardComponent,
    children: dashboardRoutes,
    canLoad: [AuthGuard]
},
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(childrenRoutes)
  ],
  exports:[RouterModule]
})
export class DashboardRoutesModule { }
