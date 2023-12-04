import { Injectable } from '@angular/core';
import {Puzzle} from "./puzzles";

@Injectable({
  providedIn: 'root'
})
export class PuzzleService {
  solvePuzzle(puzzle: Puzzle, input: string) {
    let then = performance.now();
    puzzle.answers = `<p>Part 1 [ ${puzzle.solvePart1(input)} ] time: ${this.timeFromThen(then)} ms</p>`;
    then = performance.now();
    puzzle.answers += `<p>Part 2 [ ${puzzle.solvePart2(input)} ] time: ${this.timeFromThen(then)} ms</p>`;
  }

  timeFromThen(then: number): number {
    return Math.round((performance.now() - then) * 100) / 100;
  }
}
