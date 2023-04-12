import {Component, Input} from '@angular/core';
import {DominoeTileModel} from '../dominoe-tile/model/DominoeTileModel';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.css']
})
export class HandComponent {

  @Input() hand: DominoeTileModel[] = []
  @Input() playerName: string = 'Default player'
}
