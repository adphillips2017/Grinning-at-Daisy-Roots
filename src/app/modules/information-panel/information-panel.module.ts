import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformationPanelComponent } from './information-panel.component';
import { InventoryManagerModule } from './inventory-manager/inventory-manager.module';
import { CommandsHelperModule } from './commands-helper/commands-helper.module';



@NgModule({
  declarations: [InformationPanelComponent],
  imports: [CommonModule, InventoryManagerModule, CommandsHelperModule],
  exports: [InformationPanelComponent]
})
export class InformationPanelModule { }
