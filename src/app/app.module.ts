import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DayComponent } from './day/day.component';
import {RouterModule} from "@angular/router";
import {routes} from "./app.routing.module";
import {AllDaysComponent} from "./all-days/all-days.component";
import {ReactiveFormsModule} from "@angular/forms";
import {PuzzleComponent} from "./core/puzzle.component";

@NgModule({
  declarations: [
    AppComponent,
    AllDaysComponent,
    DayComponent,
    PuzzleComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
