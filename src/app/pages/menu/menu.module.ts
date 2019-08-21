import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/members/log-workout',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'log-workout',
        loadChildren: '../logworkout/logworkout.module#LogWorkoutPageModule'
      },
      {
        path: 'add-exercise',
        loadChildren: '../editexercise/editexercise.module#EditExercisePageModule'
      },
      {
        path: 'show-workout',
        loadChildren: '../showworkout/showworkout.module#ShowWorkoutPageModule'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ MenuPage ]
})
export class MenuPageModule { }