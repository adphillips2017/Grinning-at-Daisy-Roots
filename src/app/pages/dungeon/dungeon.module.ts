import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DungeonComponent } from './dungeon.component';

import { HeroPanelModule } from '../../modules/hero-panel/hero-panel.module';
import { TerminalModule } from '../../modules/terminal/terminal.module';


@NgModule({
  declarations: [DungeonComponent],
  imports: [
    CommonModule,
    HeroPanelModule,
    TerminalModule
  ],
  exports: [DungeonComponent]
})
export class DungeonModule { }
