import {Component, OnInit} from '@angular/core';
import {DominoeTileModel} from './dominoe-tile/model/DominoeTileModel';
import {randomIntFromInterval} from '../utils/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Dominoes';
  tiles: DominoeTileModel[] = []

  ngOnInit() {
    for (let i = 0; i < 5; i++) {
      this.tiles[i] = {
        tileStartValue: randomIntFromInterval(1, 6),
        // tileStartValue: 1,
        tileEndValue: randomIntFromInterval(1, 6),
        // tileEndValue: 3,
        placedInReverse: false,
        // placedVertically: false
        placedVertically: !!(randomIntFromInterval(0, 1))
      }
    }
  }
}
