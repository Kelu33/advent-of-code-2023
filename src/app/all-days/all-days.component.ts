import { Component } from '@angular/core';
import {puzzles} from "../core/puzzles";
import {inputs} from "../core/inputs";
import {PuzzleService} from "../core/puzzle.service";

@Component({
  selector: 'app-all-days',
  template: `
    <p>Total time: {{totalTime}} ms</p>
    <ng-container *ngFor="let input of inputs; let i = index">
      <app-puzzle [link]="true" [day]="i+1" [puzzle]="puzzles[i]" [input]="input"></app-puzzle>
    </ng-container>
  `
})
export class AllDaysComponent {
  totalTime = 0;
  puzzles = puzzles;
  inputs = inputs;

  constructor(private puzzleService: PuzzleService) {
    const then = performance.now();
    inputs.forEach((input, i) => {
      this.puzzleService.solvePuzzle(this.puzzles[i], input);
    });
    this.totalTime = Math.round((performance.now() - then) * 100) / 100;
  }
}
