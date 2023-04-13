import {Component} from '@angular/core';
import {GameMode, GameState} from './game/enums/GameEnums';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Dominoes';
  gameMode: GameMode | undefined;
  gameStarted = false;

  modeSelected(mode: GameMode) {
    this.gameMode = mode;
    this.gameStarted = true;
  }
}
