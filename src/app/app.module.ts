import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DungeonModule } from './pages/dungeon/dungeon.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DungeonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
