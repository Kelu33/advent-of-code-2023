import {Component} from '@angular/core';
import {inputs} from "./core/inputs";
import {FormControl} from "@angular/forms";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";

@Component({
  selector: 'app-root',
  template: `
    <h1><a target="_blank" href="https://adventofcode.com/">{{title}}</a></h1>
    <div class="nav">
      <a class="btn" routerLink="./all-days">all-days</a>
      <a class="btn" [routerLink]="['./day', selectDay.value]">day nb:
        <select [formControl]="selectDay">
          <option *ngFor="let day of days" [value]="day">{{day}}</option>
        </select>
      </a>
    </div>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'advent-of-code-2023';
  days: number[];
  selectDay = new FormControl<number>(1);

  constructor(private router: Router, private route: ActivatedRoute) {
    this.days = [...Array(inputs.length + 1).keys()];
    this.days.shift();
    this.selectDay.valueChanges.subscribe(day => {
      router.navigate([`./day/${day}`]);
    })
    router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(e => {
      const day = e.url.split('/').pop();
      if (day && !isNaN(Number(day))) {
        this.selectDay.patchValue(parseInt(day), {emitEvent: false});
      }
    })
  }
}
