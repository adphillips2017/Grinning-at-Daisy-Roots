import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniMapComponent } from './mini-map.component';



@NgModule({
  declarations: [MiniMapComponent],
  imports: [CommonModule],
  exports: [MiniMapComponent]
})
export class MiniMapModule { }
