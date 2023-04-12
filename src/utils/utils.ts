import {DominoeTileModel} from '../app/dominoe-tile/model/DominoeTileModel';

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function convertTileModelToUnicodeChar(model: DominoeTileModel): string {
  let start: number;
  let end: number;

  if (!model.placedInReverse) {
    start = model.tileStartValue;
    end = model.tileEndValue;
  } else {
    start = model.tileEndValue
    end = model.tileStartValue;
  }

  let baseHex = parseInt('0x1F031');
  baseHex += start * 7 + end;

  if (model.placedVertically) {
    baseHex += 50;
  }

  const str = String.fromCodePoint(baseHex)
  console.log(model)
  return str;
}
