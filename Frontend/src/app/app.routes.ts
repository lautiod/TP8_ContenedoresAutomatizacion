import { Routes } from '@angular/router';
import { AddanimalComponent } from './addanimal/addanimal.component';
import { AnimalComponent } from './animal/animal.component';

export const routes: Routes = [
  { path: 'addanimal', component: AddanimalComponent },
  { path: '**', component: AnimalComponent },
];
