import { AppStorage } from './../../services/app-storage.service';
import { Component, OnInit } from '@angular/core';
import { Workout } from './../../../models/Workout';

@Component({
  selector: 'app-showworkout',
  templateUrl: 'showworkout.page.html',
  styleUrls: ['showworkout.page.scss']
})
export class ShowWorkoutPage implements OnInit {
  workouts: Workout[];

  constructor(private appStorage: AppStorage) {}

  ngOnInit() {
    this.appStorage.getWorkouts().then((storageWorkouts: Workout[]) => {
      this.workouts = storageWorkouts;

      // Sort from most recent at the top
      this.workouts.sort((leftSide, rightSide): number => {
        if (leftSide.date > rightSide.date) return -1;
        if (leftSide.date < rightSide.date) return 1;
        return 0;
      });
    });
  }

  /**
   * Remove deleted workout from view and from database.
   *
   * @param workout
   * @param index
   */
  remove(workout, index) {
    this.appStorage.deleteWorkout(workout);

    if(index > -1){
      this.workouts.splice(index, 1);
    }
  }
}
