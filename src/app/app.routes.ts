import { Routes } from '@angular/router';
import { BettingTrackerComponent } from './betting-tracker/betting-tracker.component';
import { LolMatchComponent } from './lol-match/lol-match.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: '', 
    redirectTo: '/betting-tracker', 
    pathMatch: 'full' 
  },
  { 
    path: 'betting-tracker', 
    component: BettingTrackerComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'lol-match', 
    component: LolMatchComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: '**', 
    redirectTo: '/betting-tracker' 
  }
];