import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogWorkoutPage as LogWorkoutPage } from './logworkout.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: LogWorkoutPage }])
  ],
  declarations: [LogWorkoutPage]
})
export class LogWorkoutPageModule {}
