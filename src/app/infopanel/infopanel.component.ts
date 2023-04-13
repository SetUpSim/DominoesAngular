import {Component, Input} from '@angular/core';
import {DominoeTileModel} from '../dominoe-tile/model/DominoeTileModel';
import {GameState} from '../game/enums/GameEnums';

@Component({
  selector: 'app-infopanel',
  templateUrl: './infopanel.component.html',
  styleUrls: ['./infopanel.component.css']
})
export class InfopanelComponent {
  @Input() turningPlayerName: string | undefined;
  @Input() stockToCount: DominoeTileModel[] | undefined;
  @Input() status: GameState = GameState.InProgress;

  getStatusMessage() {
    if (this.status === GameState.InProgress) {
      return '';
    }

    switch (this.status) {
      case GameState.FirstPlayerWon:
        return "First player won!";
      case GameState.SecondPlayerWon:
        return "Second player won!";
      default:
        return "It's a tie!"
    }
  }
}
