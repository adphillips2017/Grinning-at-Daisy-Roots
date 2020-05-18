import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DungeonComponent } from './pages/dungeon/dungeon.component';


const routes: Routes = [
  { path: '', component: DungeonComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
