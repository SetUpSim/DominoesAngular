export interface DominoeTileModel {
  tileStartValue: TileSideValue,
  tileEndValue: TileSideValue,
  placedInReverse: Boolean,
  placedVertically: Boolean
}

export enum TileSideValue {
  ZERO,
  ONE,
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX
}
