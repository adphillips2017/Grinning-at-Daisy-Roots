import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DungeonComponent } from './dungeon.component';

import { HeroPanelModule } from '../../modules/hero-panel/hero-panel.module';


@NgModule({
  declarations: [DungeonComponent],
  imports: [
    CommonModule,
    HeroPanelModule
  ],
  exports: [DungeonComponent]
})
export class DungeonModule { }
