import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddanimalComponent } from './addanimal/addanimal.component';
import { AnimalComponent } from './animal/animal.component';

const routes: Routes = [
  { path: 'addanimal', component: AddanimalComponent },
  { path: '**', component: AnimalComponent }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }