import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShowWorkoutPage as ShowWorkoutPage } from './showworkout.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ShowWorkoutPage }])
  ],
  declarations: [ShowWorkoutPage]
})

export class ShowWorkoutPageModule {}
