import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {DominoeTileComponent} from './dominoe-tile/dominoe-tile.component';
import { HandComponent } from './hand/hand.component';

@NgModule({
  declarations: [
    AppComponent,
    DominoeTileComponent,
    HandComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
