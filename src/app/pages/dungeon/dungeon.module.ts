import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DungeonComponent } from './dungeon.component';

import { InformationPanelModule } from '../../modules/information-panel/information-panel.module';
import { HeroPanelModule } from '../../modules/hero-panel/hero-panel.module';
import { TerminalModule } from '../../modules/terminal/terminal.module';
import { MiniMapModule } from '../../modules/mini-map/mini-map.module';


@NgModule({
  declarations: [DungeonComponent],
  imports: [
    CommonModule,
    HeroPanelModule,
    TerminalModule,
    MiniMapModule,
    InformationPanelModule
  ],
  exports: [DungeonComponent]
})
export class DungeonModule { }
