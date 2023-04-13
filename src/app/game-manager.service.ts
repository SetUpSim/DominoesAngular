import {EventEmitter, Injectable} from '@angular/core';
import {GameState} from './game/enums/GameEnums';

@Injectable({
  providedIn: 'root'
})
export class GameManagerService {

  firstHandTurn = new EventEmitter<any>();
  secondHandTurn = new EventEmitter<any>();
  gameEnded = new EventEmitter<any>();
  gameState: GameState

  constructor() {
    this.gameState = GameState.NotStarted;
  }

  emitFirstHandTurn() {
    this.firstHandTurn.emit();
  }

  emitSecondHandTurn() {
    this.secondHandTurn.emit();
  }

  emitEndGame() {
    this.gameEnded.emit();
  }
}
