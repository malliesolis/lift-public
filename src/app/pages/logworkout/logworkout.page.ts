import { Component, OnInit } from '@angular/core';
import { Workout } from './../../../models/Workout';
import { AppStorage } from 'src/app/services/app-storage.service';
import { LoadingController, NavController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ExerciseType } from 'src/models/ExerciseType';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Exercise } from 'src/models/Exercise';

@Component({
  selector: 'app-logworkout',
  templateUrl: 'logworkout.page.html',
  styleUrls: ['logworkout.page.scss']
})

export class LogWorkoutPage implements OnInit {

  workout : Workout;
  workoutId = null;
  exerciseTypes : ExerciseType[];

  showWarmUp : boolean[] = [];

  timeLeft = 60;
  interval;
  ONE_SECOND : number = 1000;

  private readonly zeroClock : string = "00:00:00";

  constructor(private appStorage : AppStorage, private loadingController : LoadingController, 
    private navController : NavController, private authenticationService : AuthenticationService,
    private alertController : AlertController, private vibration: Vibration) {}

  ngOnInit() {          
    this.setUpShellWorkout();

    this.getExerciseTypes();
  }

  ionViewWillEnter() {
    this.setUpShellWorkout();
  }

  getExerciseTypes() {
    //TODO: If navigated from Edit-Exercise, refresh cache from appStorage (might be a new exercise to add to list)
    this.appStorage.getExerciseTypes().then((etLocalCache : ExerciseType[]) => {
      this.exerciseTypes = etLocalCache;

      this.exerciseTypes.sort((etLeft, etRight): number => {
        if (etLeft.name < etRight.name) return -1;
        if (etLeft.name > etRight.name) return 1;
        return 0;
      });
    });
  }

  async startRestTimer() {
    this.timeLeft = 60;

    const loadingElement = await this.loadingController.create({
      message: this.getTimerMessage(this.timeLeft),
      spinner: 'crescent',
      backdropDismiss: true,
      duration: 1000 * 60
    });

    this.interval = setInterval(() => {
      if (!this.timerReachedZero()) {
        this.timeLeft--;
        loadingElement.setAttribute('message', this.getTimerMessage(this.timeLeft));
      }
      else {
        clearInterval(this.interval);
      }
    }, this.ONE_SECOND);

    await loadingElement.present();

    await loadingElement.onDidDismiss();
    if (this.timerReachedZero()) {
      this.showReadyAlert();
    }
  }

  async showReadyAlert() {
    this.vibration.vibrate(250);

    const alert = await this.alertController.create({
      header: 'It\'s GO Time!',
      subHeader: 'You\'ve rested enough.',
      message: 'If you think lifting is dangerous, try being weak.',
      buttons: ['Ready!']
    });

    await alert.present();
  }

  selectExerciseTypeById($event) {
    let data = $event.target.value.split(",");
    let exerciseTypeId = data[0];
    let index = data[1];

    let notFound : boolean = true;

    this.exerciseTypes.forEach((exerciseType: ExerciseType) => {
      if(notFound) {
        if (exerciseType.storageId === exerciseTypeId) {
          this.workout.exercise[index].exerciseType = exerciseType;
          notFound = false;
        }
      }
    });
  }

  private setUpShellWorkout() {
    var numberOfExercises : number = 4;
    var index : number;

    this.workout = {
      date : new Date(),
      exercise : [],
      note : '',
      userId : ''
    };

    for(index = 0; index < numberOfExercises; index++) {
      let shellExercise : Exercise = {
        exerciseType : {
          name : '',
          muscleGroupsUsed : [
            {
              name: ''
            }
          ],
          usesWeights : true,
          basedOn: 'reps'
        }, 
        note : '',
        sets : [
            {
              repCount : null,
              weight : null,
              time : this.zeroClock
            },
            {
              repCount : null,
              weight : null,
              time : this.zeroClock
            },
            {
              repCount : null,
              weight : null,
              time : this.zeroClock
          }
          ]
      }

      this.workout.exercise.push(shellExercise);

      // Default value TRUE only for first exercise
      this.showWarmUp.push(index == 0);
    }
  }

  async saveWorkout() {
    const loading = await this.loadingController.create({
      message: 'Saving Workout...',
      animated: true
    });
    await loading.present();

    this.appStorage.addWorkout(this.workout).then(() => {
      loading.dismiss();
      this.navController.navigateForward('/members/show-workout');
    })
  }

  logout() {
    this.authenticationService.logout();
  }

  private getTimerMessage(timeLeft : number) : string {
    return 'Rest up, Champ... Begin again in... ' + timeLeft + ' seconds.';
  }

  private timerReachedZero(): boolean {
    return this.timeLeft == 0;
  }

}
