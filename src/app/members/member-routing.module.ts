import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../services/auth-guard.service';

const routes: Routes = [
  { path: 'log-workout', loadChildren: '../pages/logworkout/logworkout.module#LogWorkoutPageModule' },
  // { path: 'editworkout/{:id}', loadChildren: './pages/logworkout/logworkout.module#LogWorkoutPageModule' },
  { path: 'show-workout', loadChildren: '../pages/showworkout/showworkout.module#ShowWorkoutPageModule' },
  { path: 'add-exercise', loadChildren: '../pages/editexercise/editexercise.module#EditExercisePageModule' },
  // { path: 'editexercise/{:id}', loadChildren: './pages/editexercise/editexercise.module#EditExercisePageModule' },
  { path: 'menu', loadChildren: '../pages/menu/menu.module#MenuPageModule' },

  {
    path: 'members',
    canActivate: [AuthGuardService],
    loadChildren: './member-routing.module#MemberRoutingModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class MemberRoutingModule {}
