import {Component} from '@angular/core';
import {GameMode, GameState} from './game/enums/GameEnums';
import {GameManagerService} from './game-manager.service';
import {ComputerPlayerService} from './computer-player.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [GameManagerService, ComputerPlayerService]
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
