import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {DominoeTileComponent} from './dominoe-tile/dominoe-tile.component';
import { HandComponent } from './hand/hand.component';
import { BoardComponent } from './board/board.component';
import { GameComponent } from './game/game.component';
import { InfopanelComponent } from './infopanel/infopanel.component';

@NgModule({
  declarations: [
    AppComponent,
    DominoeTileComponent,
    HandComponent,
    BoardComponent,
    GameComponent,
    InfopanelComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
