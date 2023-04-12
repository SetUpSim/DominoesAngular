import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DominoeTileModel} from './model/DominoeTileModel';
import {convertTileModelToUnicodeChar} from '../../utils/utils';

@Component({
  selector: 'app-dominoe-tile',
  templateUrl: './dominoe-tile.component.html',
  styleUrls: ['./dominoe-tile.component.css']
})
export class DominoeTileComponent {
  @Input() tileModel: DominoeTileModel | undefined

  getStyles(): any {
    if (!this.tileModel) {
      return {}
    }

    return this.tileModel.placedVertically ?
      {
        'width': '4rem',
        'height': '8rem',
        'flex-direction': 'column'
      } :
      {
        'width': '8rem',
        'height': '4rem',
        'flex-direction': 'row'
      };
  }
}

