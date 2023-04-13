import {Component, Input, OnInit} from '@angular/core';
import {DominoeTileModel} from '../dominoe-tile/model/DominoeTileModel';
import {shuffleArray} from '../../utils/utils';
import {v4 as uuidv4} from 'uuid'
import {GameMode, GameState} from './enums/GameEnums';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  @Input() gameMode: GameMode = GameMode.PvP;
  @Input() firstPlayerName = '';
  @Input() secondPlayerName = '';

  gameState: GameState = GameState.InProgress;
  tilesInFirstHand: DominoeTileModel[] = [];
  tilesInSecondHand: DominoeTileModel[] = [];
  tilesOnBoard: DominoeTileModel[] = [];
  tilesInStock: DominoeTileModel[] = [];

  isFirstPlayersTurn = true;

  ngOnInit() {
    this.initNewGame();
  }

  initNewGame() {
    const set = this.generateSetOfTiles();
    this.tilesInFirstHand = this.distributeHand(set);
    this.tilesInSecondHand = this.distributeHand(set);
    this.tilesInStock = set;
    this.isFirstPlayersTurn = true;
  }

  private distributeHand(ofTiles: DominoeTileModel[]): DominoeTileModel[] {
    const length = ofTiles.length;
    if (!(length === 28 || length === 21)) {
      throw {
        message: `Invalid game state while distribution, there is ${ofTiles.length} tiles in stock`
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

  isTurnValid(tile: DominoeTileModel): PossibleInsert {
    if (this.tilesOnBoard.length === 0) {
      return PossibleInsert.Start;
    }

    const boardStartTile = this.getFirstTileOnBoard();
    const boardStartValue = boardStartTile.placedInReverse ? boardStartTile.tileEndValue : boardStartTile.tileStartValue;

    const boardEndTile = this.getLastTileOnBoard();
    const boardEndValue = boardEndTile.placedInReverse ? boardEndTile.tileStartValue : boardEndTile.tileEndValue;

    const isInsertToStartPossible = tile.tileStartValue === boardStartValue || tile.tileEndValue === boardStartValue;
    const isInsertToEndPossible = tile.tileStartValue === boardEndValue || tile.tileEndValue === boardEndValue;

    if (isInsertToStartPossible && isInsertToEndPossible) {
      return PossibleInsert.Both;
    }

    if (isInsertToStartPossible) {
      return PossibleInsert.Start;
    }

    if (isInsertToEndPossible) {
      return PossibleInsert.End;
    }

    return PossibleInsert.None;
  }

  onFirstHandSelect(event: DominoeTileModel) {
    const possibleInsert = this.isTurnValid(event)
    if (possibleInsert === PossibleInsert.Both) {
      const toStart = this.promptUserStartOrEnd();
      this.makeFirstHandTurn(event, toStart ? PossibleInsert.Start : PossibleInsert.End);
      this.checkHandsForWinner();
      this.isFirstPlayersTurn = false;
    }
    if (possibleInsert !== PossibleInsert.None) {
      this.makeFirstHandTurn(event, possibleInsert)
      this.checkHandsForWinner();
      this.isFirstPlayersTurn = false;
    }

    console.log('This turn is invalid! Not possible to insert the following tile to board: ', event);
  }

  private makeFirstHandTurn(tile: DominoeTileModel, insert: PossibleInsert) {
    const model = {...tile}
    const index = this.tilesInFirstHand.indexOf(tile);
    model.placedVertically = false;
    this.tilesInFirstHand.splice(index, 1);
    if (insert === PossibleInsert.Start) {
      this.insertTileToStartOfBoard(model);
    } else if (insert === PossibleInsert.End) {
      this.insertTileToEndOfBoard(model);
    }
  }

  onSecondHandSelect(event: DominoeTileModel) {
    const possibleInsert = this.isTurnValid(event)
    if (possibleInsert === PossibleInsert.Both) {
      const toStart = this.promptUserStartOrEnd();
      this.makeSecondHandTurn(event, toStart ? PossibleInsert.Start : PossibleInsert.End);
      this.checkHandsForWinner();
      this.isFirstPlayersTurn = true;
    }
    if (possibleInsert !== PossibleInsert.None) {
      this.makeSecondHandTurn(event, possibleInsert)
      this.checkHandsForWinner();
      this.isFirstPlayersTurn = true;
    }

    console.log('This turn is invalid! Not possible to insert the following tile to board: ', event);
  }

  private makeSecondHandTurn(tile: DominoeTileModel, insert: PossibleInsert) {
    const model = {...tile}
    const index = this.tilesInSecondHand.indexOf(tile);
    model.placedVertically = false;
    this.tilesInSecondHand.splice(index, 1);
    if (insert === PossibleInsert.Start) {
      this.insertTileToStartOfBoard(model);
    } else if (insert === PossibleInsert.End) {
      this.insertTileToEndOfBoard(model);
    }
  }

  private insertTileToStartOfBoard(tile: DominoeTileModel) {
    const boardStart = this.getFirstTileOnBoard();
    if (boardStart) {
      const firstBoardTileStart = boardStart.placedInReverse ? boardStart.tileEndValue : boardStart.tileStartValue;
      if (firstBoardTileStart !== tile.tileEndValue) {
        tile.placedInReverse = true;
      }
    }
    if (tile.tileStartValue === tile.tileEndValue) {
      tile.placedVertically = true;
    }

    this.tilesOnBoard.unshift(tile);
  }

  private insertTileToEndOfBoard(tile: DominoeTileModel) {
    const boardEnd = this.getLastTileOnBoard();
    if (boardEnd) {
      const lastBoardTileEnd = boardEnd?.placedInReverse ? boardEnd.tileStartValue : boardEnd.tileEndValue;
      if (lastBoardTileEnd !== tile.tileStartValue) {
        tile.placedInReverse = true;
      }
    }
    if (tile.tileStartValue === tile.tileEndValue) {
      tile.placedVertically = true;
    }

    this.tilesOnBoard.push(tile);
  }

  private getFirstTileOnBoard(): DominoeTileModel {
    return this.tilesOnBoard[0];
  }

  private getLastTileOnBoard(): DominoeTileModel {
    return this.tilesOnBoard[this.tilesOnBoard.length - 1];
  }

  private promptUserStartOrEnd(): boolean {
    const message = 'Do you want to insert a tile to the start or end of the board? Type \'start\' for first option, any other input would be considered as \'end\'';
    const result = prompt(message)
    if (!result) {
      return this.promptUserStartOrEnd();
    }
    if (result === 'start') {
      return true;
    }
    return false
  }

  drawTileFromStock(forFirstPlayer: boolean) {
    const toDraw = this.tilesInStock.pop()

    if (!toDraw) {
      this.checkStockForTie();
      return;
    }
    if (forFirstPlayer) {
      this.tilesInFirstHand.push(toDraw);
    } else {
      this.tilesInSecondHand.push(toDraw);

    }
  }

  getHandStyle(forFirstPlayerHand: boolean): object {
    const predicate = (this.isFirstPlayersTurn && forFirstPlayerHand) ||
      (!this.isFirstPlayersTurn && !forFirstPlayerHand)
    return predicate ? {} : {
      'pointer-events': 'none',
      'filter': 'blur(10px)'
    }
  }

  getNgStyle(): object {
    if (this.gameState !== GameState.InProgress) {
      return {
        'pointer-events': 'none'
      }
    }
    return {}
  }

  private checkHandsForWinner() {
    const firstHandEmpty = this.tilesInFirstHand.length === 0;
    const secondHandEmpty = this.tilesInSecondHand.length === 0;

    if (firstHandEmpty) {
      this.gameState = GameState.FirstPlayerWon;
    } else if (secondHandEmpty) {
      this.gameState = GameState.SecondPlayerWon;
    }
  }

  checkStockForTie() {
    if (this.tilesInStock.length === 0) {
      this.gameState = GameState.Tie;
    }
  }
}

enum PossibleInsert {
  End,
  Start,
  Both,
  None
}
