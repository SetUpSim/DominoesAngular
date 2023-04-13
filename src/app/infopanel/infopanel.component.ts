import {Component, Input} from '@angular/core';
import {DominoeTileModel} from '../dominoe-tile/model/DominoeTileModel';

@Component({
  selector: 'app-infopanel',
  templateUrl: './infopanel.component.html',
  styleUrls: ['./infopanel.component.css']
})
export class InfopanelComponent {
  @Input() turningPlayerName: string | undefined;
  @Input() dequeToCount: DominoeTileModel[] | undefined;
}
