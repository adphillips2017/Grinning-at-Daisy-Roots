import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterCreatorComponent } from './character-creator.component';



@NgModule({
  declarations: [CharacterCreatorComponent],
  imports: [CommonModule],
  exports: [CharacterCreatorComponent]
})
export class CharacterCreatorModule { }
