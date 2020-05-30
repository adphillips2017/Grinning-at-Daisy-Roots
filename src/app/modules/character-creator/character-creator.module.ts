import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CharacterCreatorComponent } from './character-creator.component';
import { HeroPanelModule } from '../hero-panel/hero-panel.module';



@NgModule({
  declarations: [CharacterCreatorComponent],
  imports: [CommonModule, HeroPanelModule, FormsModule],
  exports: [CharacterCreatorComponent]
})
export class CharacterCreatorModule { }
