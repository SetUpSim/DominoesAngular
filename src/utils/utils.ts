export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export function countElementsInArray(array: number[]): object {
  const elementCount = {}
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    // @ts-ignore
    if (elementCount[element]) {
      // @ts-ignore
      elementCount[element] += 1;
    } else {
      // @ts-ignore
      elementCount[element] = 1;
    }
  }
  return elementCount;

}
