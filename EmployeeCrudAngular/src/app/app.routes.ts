import { Routes } from '@angular/router';
import { AddemployeeComponent } from './addemployee/addemployee.component';
import { EmployeeComponent } from './employee/employee.component';

export const routes: Routes = [
  { path: 'addemployee', component: AddemployeeComponent },
  { path: '**', component: EmployeeComponent },
];
