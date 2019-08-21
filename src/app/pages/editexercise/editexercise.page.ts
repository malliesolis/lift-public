import { AppStorage } from './../../services/app-storage.service';
import { Component, OnInit } from '@angular/core';
import { MuscleGroup } from './../../../models/MuscleGroup';
import { LoadingController, NavController } from '@ionic/angular';
import { ExerciseType } from 'src/models/ExerciseType';

@Component({
  selector: 'app-editexercise',
  templateUrl: './editexercise.page.html',
  styleUrls: ['./editexercise.page.scss'],
})

export class EditExercisePage implements OnInit {
  muscleGroups : MuscleGroup [];
  exerciseType: ExerciseType = {
    name: '',
    basedOn : 'reps',
    hasWeights : true,
    muscleGroup: []
  };

  // exerciseTypeId : null;

  constructor(private appStorage: AppStorage, private loadingController : LoadingController, private navController : NavController) {}

  ngOnInit() {
    this.appStorage.getMuscleGroups().then((muscleGroupStorage: MuscleGroup[]) => {
      this.muscleGroups = muscleGroupStorage;
    });

    this.setUpShellExerciseType();
  }

  ionViewWillEnter() {
    this.setUpShellExerciseType();
  }

  private setUpShellExerciseType() {
    this.exerciseType = {
      name: '',
      basedOn : 'reps',
      hasWeights : true,
      muscleGroup: []
    };
  }

  async saveExercise() {
    const loading = await this.loadingController.create({
      message: 'Saving Exercise...',
      animated: true
    });
    await loading.present();

    // if (this.exerciseTypeId) {
    //   this.appStorage.updateExerciseType(this.exerciseType)
    // } else {
      this.appStorage.addExerciseType(this.exerciseType);      
    // }

    loading.dismiss();
    this.navController.back(); 

    console.log('ngOnInit');
    console.log(this.muscleGroups);

  }

}
