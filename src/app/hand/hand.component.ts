import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DominoeTileModel} from '../dominoe-tile/model/DominoeTileModel';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.css']
})
export class HandComponent {

  @Input() isPlayedByComputer = false;
  @Input() hand: DominoeTileModel[] = [];
  @Input() playerName: string = 'Default player';
  @Output() tileSelected = new EventEmitter<DominoeTileModel>();

  tileClicked(event: string) {
    const tileClicked = this.findTileById(event);
    this.tileSelected.emit(tileClicked);
  }

  findTileById(id: string): DominoeTileModel | undefined {
    return this.hand.find(m => m.id === id);
  }

  getNgStyle(): object {
    return this.isPlayedByComputer ? {
      'pointer-events': 'none'
    } : {}
  }
}
