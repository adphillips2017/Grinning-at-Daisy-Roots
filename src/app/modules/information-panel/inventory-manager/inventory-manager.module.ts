import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryManagerComponent } from './inventory-manager.component';



@NgModule({
  declarations: [InventoryManagerComponent],
  imports: [CommonModule],
  exports: [InventoryManagerComponent]
})
export class InventoryManagerModule { }
