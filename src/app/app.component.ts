import {Component, OnInit} from '@angular/core';
import {DominoeTileModel} from './dominoe-tile/model/DominoeTileModel';
import {randomIntFromInterval} from '../utils/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Dominoes';
}
