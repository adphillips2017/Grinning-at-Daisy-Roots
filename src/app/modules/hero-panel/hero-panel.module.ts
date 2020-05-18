import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroPanelComponent } from './hero-panel.component';



@NgModule({
  declarations: [HeroPanelComponent],
  imports: [CommonModule],
  exports: [HeroPanelComponent]
})
export class HeroPanelModule { }
