import {Component, Input, OnInit} from '@angular/core';
import {DominoeTileModel} from '../dominoe-tile/model/DominoeTileModel';
import {shuffleArray} from '../../utils/utils';
import {v4 as uuidv4} from 'uuid'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  tilesInFirstHand: DominoeTileModel[] = [];
  tilesInSecondHand: DominoeTileModel[] = [];
  tilesOnBoard: DominoeTileModel[] = [];
  tilesInDeque: DominoeTileModel[] = [];

  @Input() gameMode: GameMode = GameMode.PvP


  ngOnInit() {
    this.initNewGame();
  }

  initNewGame() {
    const set = this.generateSetOfTiles();
    this.tilesInFirstHand = this.distributeHand(set);
    this.tilesInSecondHand = this.distributeHand(set);
    this.tilesInDeque = set;
  }

  private distributeHand(ofTiles: DominoeTileModel[]): DominoeTileModel[] {
    const length = ofTiles.length;
    if (!(length === 28 || length === 21)) {
      throw {
        message: `Invalid game state while distribution, there is ${ofTiles.length} tiles in deque`
      };
    }
    const spliced = ofTiles.splice(0, 7);
    return spliced
  }

  private generateSetOfTiles(): DominoeTileModel[] {
    const tiles: DominoeTileModel[] = [];
    for (let i = 0; i <= 6; i++) {
      for (let j = 0; j <= 6; j++) {
        const predicate = (m: DominoeTileModel) => m.tileEndValue === i && m.tileStartValue === j;
        if (!tiles.find(predicate)) {
          tiles.push({
            id: uuidv4(),
            tileStartValue: i,
            tileEndValue: j,
            placedInReverse: false,
            placedVertically: true
          });
        }
      }
    }
    shuffleArray(tiles);
    return tiles
  }

  onFistHandSelect(event: DominoeTileModel) {
    const index = this.tilesInFirstHand.indexOf(event);
    const model = {...event};
    model.placedVertically = false;
    this.tilesInFirstHand.splice(index, 1);
    this.tilesOnBoard.unshift(model);
  }

  onSecondHandSelect(event: DominoeTileModel) {
    const index = this.tilesInSecondHand.indexOf(event);
    const model = {...event};
    model.placedVertically = false;
    this.tilesInSecondHand.splice(index, 1);
    this.tilesOnBoard.push(model);
  }
}

enum GameMode {
  PvP, // player vs player
  CvP, // computer vs player
  CvC // computer vs computer
}
