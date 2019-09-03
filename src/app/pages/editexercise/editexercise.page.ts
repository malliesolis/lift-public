import { AppStorage } from './../../services/app-storage.service';
import { Component, OnInit } from '@angular/core';
import { MuscleGroup } from './../../../models/MuscleGroup';
import { LoadingController, NavController } from '@ionic/angular';
import { ExerciseType as ExerciseDetails } from 'src/models/ExerciseType';

@Component({
  selector: 'app-editexercise',
  templateUrl: './editexercise.page.html',
  styleUrls: ['./editexercise.page.scss'],
})

export class EditExercisePage implements OnInit {
  muscleGroups : MuscleGroup [];
  exerciseDetails: ExerciseDetails = {
    name: '',
    basedOn : 'reps',
    usesWeights : true,
    muscleGroupsUsed: []
  };

  constructor(
    private appStorage: AppStorage,
    private loadingController : LoadingController,
    private navController : NavController ) {}

  ngOnInit() {
    this.appStorage.getMuscleGroups().then((muscleGroupCache: MuscleGroup[]) => {
      this.muscleGroups = muscleGroupCache;
    });

    this.setUpShellExerciseDetail();
  }

  ionViewWillEnter() {
    this.setUpShellExerciseDetail();
  }

  private setUpShellExerciseDetail() {
    this.exerciseDetails = {
      name: '',
      basedOn : 'reps',
      usesWeights : true,
      muscleGroupsUsed: []
    };
  }

  async saveExercise() {
    const loading = await this.loadingController.create({
      message: 'Saving Exercise...',
      animated: true
    });
    await loading.present();

    this.appStorage.addExercise(this.exerciseDetails);

    loading.dismiss();
    this.navController.back(); 
  }

}
