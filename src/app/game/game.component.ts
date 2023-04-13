import {Component, Input, OnInit} from '@angular/core';
import {DominoeTileModel} from '../dominoe-tile/model/DominoeTileModel';
import {shuffleArray} from '../../utils/utils';
import {v4 as uuidv4} from 'uuid'
import {GameMode, GameState, PossibleInsert} from './enums/GameEnums';
import {GameManagerService} from '../game-manager.service';
import {ComputerPlayerService} from '../computer-player.service';
import {Subscription} from 'rxjs';

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
  readonly computerTurnDelay = 3000

  ngOnInit() {
    this.initNewGame();
  }

  constructor(private readonly managerService: GameManagerService,
              private readonly computerPlayerService: ComputerPlayerService) {
  }

  initNewGame() {
    const set = this.generateSetOfTiles();
    this.tilesInFirstHand = this.distributeHand(set);
    this.tilesInSecondHand = this.distributeHand(set);
    this.tilesInStock = set;
    this.isFirstPlayersTurn = true;

    const subscriptions: Subscription[] = []

    switch (this.gameMode) {
      case GameMode.PvC:
        const subscription = this.managerService.secondHandTurn.subscribe(() => this.makeComputerMove(false));
        subscriptions.push(subscription)
        break;
      case GameMode.CvC:
        const subscriptionFirst = this.managerService.firstHandTurn.subscribe(() => this.makeComputerMove(true))
        const subscriptionSecond = this.managerService.secondHandTurn.subscribe(() => this.makeComputerMove(false));
        subscriptions.push(subscriptionFirst, subscriptionSecond)
        break;
      default:
        break;
    }

    this.managerService.gameEnded.subscribe(() => {
      for (let subscription of subscriptions) {
        subscription.unsubscribe();
      }
    })

    this.managerService.firstHandTurn.emit();
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
      const toStart = this.gameMode === GameMode.PvP || this.gameMode === GameMode.PvC && this.isFirstPlayersTurn ? this.promptUserStartOrEnd() : true;
      this.makeFirstHandTurn(event, toStart ? PossibleInsert.Start : PossibleInsert.End);
      this.checkHandsForWinner();
      this.isFirstPlayersTurn = false;
      return;
    }
    if (possibleInsert !== PossibleInsert.None) {
      this.makeFirstHandTurn(event, possibleInsert)
      this.checkHandsForWinner();
      this.isFirstPlayersTurn = false;
      return;
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

    this.managerService.emitSecondHandTurn();
  }

  onSecondHandSelect(event: DominoeTileModel) {
    const possibleInsert = this.isTurnValid(event)
    if (possibleInsert === PossibleInsert.Both) {
      const toStart = this.promptUserStartOrEnd();
      this.makeSecondHandTurn(event, toStart ? PossibleInsert.Start : PossibleInsert.End);
      this.checkHandsForWinner();
      this.isFirstPlayersTurn = true;
      return;
    }
    if (possibleInsert !== PossibleInsert.None) {
      this.makeSecondHandTurn(event, possibleInsert)
      this.checkHandsForWinner();
      this.isFirstPlayersTurn = true;
      return;
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

    this.managerService.emitFirstHandTurn();
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
      this.managerService.emitFirstHandTurn();
    } else {
      this.tilesInSecondHand.push(toDraw);
      this.managerService.emitSecondHandTurn();
    }
  }

  getHandStyle(forFirstPlayerHand: boolean): object {
    const disabled = {
      'pointer-events': 'none'
    };
    const blurred = {
      ...disabled,
      'filter': 'blur(10px)'
    };
    const predicate = (this.isFirstPlayersTurn && forFirstPlayerHand) ||
      (!this.isFirstPlayersTurn && !forFirstPlayerHand);

    switch (this.gameMode) {
      case GameMode.PvP:
        return predicate ? {} : blurred;
      case GameMode.CvC:
        return disabled;
      case GameMode.PvC:
        return forFirstPlayerHand ? {} : blurred;
    }
  }

  private checkHandsForWinner() {
    const firstHandEmpty = this.tilesInFirstHand.length === 0;
    const secondHandEmpty = this.tilesInSecondHand.length === 0;

    if (firstHandEmpty) {
      this.gameState = GameState.FirstPlayerWon;
      this.managerService.emitEndGame();
    } else if (secondHandEmpty) {
      this.gameState = GameState.SecondPlayerWon;
      this.managerService.emitEndGame();
    }
  }

  checkStockForTie() {
    if (this.tilesInStock.length === 0) {
      this.gameState = GameState.Tie;
    }
  }

  makeComputerMove(asFirstPlayer: boolean) {
    this.isFirstPlayersTurn = asFirstPlayer;
    setTimeout(() => {
      const hand = asFirstPlayer ? this.tilesInFirstHand : this.tilesInSecondHand;

      this.computerPlayerService.decideComputerMove(hand, this.tilesOnBoard, this.isTurnValid.bind(this)).then((tileDecided) => {
        if (tileDecided) {
          console.log(`Computer ${asFirstPlayer ? 1 : 2} selected ${tileDecided.tileStartValue}:${tileDecided.tileEndValue}`);
          const position = this.isTurnValid(tileDecided);
          const insertOption = position === PossibleInsert.Both ? PossibleInsert.Start : position
          if (asFirstPlayer) {
            this.makeFirstHandTurn(tileDecided, insertOption)
            this.checkHandsForWinner();
          } else {
            this.makeSecondHandTurn(tileDecided, insertOption)
            this.checkHandsForWinner();
          }
          if (this.gameMode === GameMode.PvC) {
            this.isFirstPlayersTurn = !asFirstPlayer;
          }

        } else {
          console.log(`Computer ${asFirstPlayer ? 1 : 2} draws`);
          this.drawTileFromStock(asFirstPlayer);
        }
      });


    }, this.computerTurnDelay);
  }

  getNgStyle(): object {
    if (this.gameState !== GameState.InProgress) {
      return {
        'pointer-events': 'none'
      }
    }
    return {}
  }
}
