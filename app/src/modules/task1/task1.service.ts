import { Injectable } from '@nestjs/common';

@Injectable()
export class Task1Service {
  private twoPairValues = [
    [1, 5],
    [9, -7],
    [0, 8],
    [6, 3],
    [4, 11],
    [14, 0],
    [8, 1],
    [4, 9],
  ];

  private targetValue = 9;

  private findLastPairIndex(array: number[][], target: number): number {
    for (let i = array.length - 1; i >= 0; i--) {
      if (array[i][0] + array[i][1] === target) {
        return i;
      }
    }
    return -1;
  }

  findAll(): number {
    return this.findLastPairIndex(this.twoPairValues, this.targetValue);
  }
}
