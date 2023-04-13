import {Component, Input} from '@angular/core';
import {DominoeTileModel} from '../dominoe-tile/model/DominoeTileModel';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  @Input() tiles: DominoeTileModel[] = []
}
