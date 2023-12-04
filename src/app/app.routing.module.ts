import {RouterModule, Routes} from '@angular/router';
import {DayComponent} from "./day/day.component";
import {NgModule} from "@angular/core";
import {AllDaysComponent} from "./all-days/all-days.component";

export const routes: Routes = [
  { path: 'all-days', component: AllDaysComponent },
  { path: 'day/:day', component: DayComponent },
];

@NgModule({
  imports: [RouterModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
