import {Component, EventEmitter, Output} from '@angular/core';
import {GameMode} from '../game/enums/GameEnums';

@Component({
  selector: 'app-modeselector',
  templateUrl: './modeselector.component.html',
  styleUrls: ['./modeselector.component.css']
})
export class ModeselectorComponent {
  @Output() modeSelected = new EventEmitter<GameMode>();
}
