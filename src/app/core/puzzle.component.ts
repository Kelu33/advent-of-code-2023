import {Component, Input, OnInit} from '@angular/core';
import {Puzzle} from "./puzzles";

@Component({
  selector: 'app-puzzle',
  template: `
    <div class="nav">
      <h2>Day {{day}}</h2>
      <a class="btn" target="_blank" [href]="'https://adventofcode.com/2023/day/' + day">{{puzzle.title}}</a>
      <a *ngIf="link" [routerLink]="['/day', day]">🠞</a>
      <a *ngIf="!link" routerLink="/all-days">🠜</a>
    </div>
    <div>
    </div>
    <div [innerHTML]="puzzle.answers"></div>
    <div [class.show]="puzzle.showInput" class="input-wrap">
      <button (click)="puzzle.showInput = !puzzle.showInput">{{puzzle.showInput ? 'x' : 'input'}}</button>
      <pre class="input">{{input}}</pre>
    </div>
  `
})
export class PuzzleComponent {
  @Input() day = 1;
  @Input() input = '';
  @Input() puzzle!: Puzzle;
  @Input() link = false;
}
