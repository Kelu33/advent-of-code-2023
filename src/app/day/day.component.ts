import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {inputs} from "../core/inputs";
import {Puzzle, puzzles} from "../core/puzzles";
import {map, Observable} from "rxjs";
import {PuzzleComponent} from "../core/puzzle.component";
import {PuzzleService} from "../core/puzzle.service";

@Component({
  selector: 'app-day',
  template: `
    <ng-container *ngIf="day$ | async as day">
      <app-puzzle [day]="day" [puzzle]="puzzle" [input]="input"></app-puzzle>
    </ng-container>
  `
})
export class DayComponent {
  @ViewChild(PuzzleComponent) puzzleComponent!: PuzzleComponent;
  input = '';
  puzzle!: Puzzle;
  day$!: Observable<number>;

  constructor(private route: ActivatedRoute, private puzzleService: PuzzleService) {
    this.day$ = this.route.params.pipe(
      map(param => {
        const day = param['day'] ?? 1;
        this.input = inputs[day - 1] ?? '';
        this.puzzle = puzzles[day - 1];
        this.puzzleService.solvePuzzle(this.puzzle, this.input);
        return day;
      })
    );
  }
}
