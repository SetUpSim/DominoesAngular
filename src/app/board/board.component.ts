import {Component, Input} from '@angular/core';
import {DominoeTileModel} from '../dominoe-tile/model/DominoeTileModel';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  @Input() tiles: DominoeTileModel[] = []

  getBoardTileClass(index: number): string[] {
    if (this.tiles.length < 5) {
      return []
    }

    if (index === 1) {
      console.log(`${index}: delimited`)
      return ['delimited'];
    }

    if (index > 1 && index < this.tiles.length - 2) {
      console.log(`${index}: collapsed`)
      return ['collapsed'];
    }

    return []
  }
}
