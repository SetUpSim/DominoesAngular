import {Injectable} from '@angular/core';
import {countElementsInArray} from '../utils/utils';
import {DominoeTileModel} from './dominoe-tile/model/DominoeTileModel';
import {PossibleInsert} from './game/enums/GameEnums';

@Injectable({
  providedIn: 'root'
})
export class ComputerPlayerService {

  private mode = ComputerPlayerMode.JsImperative;

  constructor() {
  }

  async decideComputerMove(hand: DominoeTileModel[], board: DominoeTileModel[],
                     isValid: (tile: DominoeTileModel) => PossibleInsert): Promise<DominoeTileModel | undefined> {
    switch (this.mode) {
      case ComputerPlayerMode.JsImperative:
        return this.decideComputerMoveJs(hand, board, isValid);

      case ComputerPlayerMode.Prolog:
        return await this.decideComputerMoveProlog(hand, board, isValid);
    }
  }

  decideComputerMoveJs(hand: DominoeTileModel[], board: DominoeTileModel[],
                       isValid: (tile: DominoeTileModel) => PossibleInsert): DominoeTileModel | undefined {
    const func = (m: DominoeTileModel) => [m.tileStartValue, m.tileEndValue]

    const numbersArr = hand.map(func).concat(
      board.map(func)
    );

    const ranks = countElementsInArray(numbersArr.flat());
    const handRanked = {}

    for (let tile of hand) {
      // @ts-ignore
      handRanked[tile.id] = ranks[tile.tileStartValue] + ranks[tile.tileEndValue];
    }

    let highestScored: string | undefined;
    let highestScore = 0;
    for (let tileId of Object.keys(handRanked)) {
      // @ts-ignore
      const tileRank = handRanked[tileId];
      const validity = isValid(hand.find(m => m.id === tileId)!)
      if (tileRank > highestScore && validity !== PossibleInsert.None) {
        highestScored = tileId;
        highestScore = tileRank;
      }
    }

    if (highestScored) {
      return hand.find(m => m.id === highestScored);
    }

    return undefined;
  }

  async decideComputerMoveProlog(hand: DominoeTileModel[], board: DominoeTileModel[],
                           isValid: (tile: DominoeTileModel) => PossibleInsert): Promise<DominoeTileModel | undefined> {
    const mapFunc = (m: DominoeTileModel) => [m.tileStartValue, m.tileEndValue]
    const handForGoal = JSON.stringify(hand.map(mapFunc));
    const boardForGoal = JSON.stringify(board.map(mapFunc));

    let goal: string;
    if (board.length == 0) {
      goal = `decide(${handForGoal}, Tile).`;
    } else {
      const boardStart = board[0].placedInReverse ? board[0].tileEndValue : board[0].tileStartValue;
      const boardEnd = board[board.length - 1].placedInReverse ?
        board[board.length - 1].tileStartValue :
        board[board.length - 1].tileEndValue;

      goal = `decide(${handForGoal}, ${boardForGoal}, ${boardStart}, ${boardEnd}, Tile).`;
    }

    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({query: goal})
    }

    const result = await fetch('http://localhost:8080/api/dominoes/prolog', request);
    let json = await result.json();
    const tileStart = json[0];
    const tileEnd = json[1];
    return hand.find(m => m.tileStartValue === tileStart && m.tileEndValue === tileEnd);
  }
}


enum ComputerPlayerMode {
  JsImperative,
  Prolog
}
