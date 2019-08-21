import { Component, OnInit } from '@angular/core';
import { Workout } from './../../../models/Workout';
import { AppStorage } from 'src/app/services/app-storage.service';
import { ActivatedRoute } from '@angular/router';
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

  private readonly resetClock : string = "00:00:00";

  constructor(private appStorage : AppStorage, private router : ActivatedRoute, private loadingController : LoadingController, 
    private navController : NavController, private authenticationService : AuthenticationService,
    private alertController : AlertController, private vibration: Vibration) {}

  ngOnInit() {          
    this.setUpShellWorkout();

    this.appStorage.getExerciseTypes().then((etStorage : ExerciseType[]) => {
      this.exerciseTypes = etStorage;

      this.exerciseTypes.sort((leftSide, rightSide): number => {
        if (leftSide.name < rightSide.name) return -1;
        if (leftSide.name > rightSide.name) return 1;
        return 0;
      });
    });

    // this.workoutId = this.router.snapshot.params['id'];
    //   if (this.workoutId) {
    //     this.loadWorkout();
    //   }   
  }

  ionViewWillEnter() {
    this.setUpShellWorkout();
  }

  async presentCountdown() {
    const loadingElement = await this.loadingController.create({
      message: 'Rest up, Champ... Begin again in... '+ this.timeLeft,
      spinner: 'crescent',
      duration: 1000 * 61
    });

    this.timeLeft = 60;

    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        loadingElement.setAttribute('message', 'Rest up, Champ... Begin again in ' + this.timeLeft + ' seconds.');
      } else {
        //Stop Timer after 1 Minute
        clearInterval(this.interval);
      }
    }, 1000);

    await loadingElement.present();

    await loadingElement.onDidDismiss();
    this.presentAlert();
  }

  async presentAlert() {
    this.vibration.vibrate(500);

    const alert = await this.alertController.create({
      header: 'It\'s GO Time!',
      subHeader: 'You\'ve rested enough.',
      message: 'Good, better, best. Never let it rest, \'till your good is better and your better is best!',
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
      if(notFound && exerciseType.storageId === exerciseTypeId) {
        this.workout.exercise[index].exerciseType = exerciseType;
        notFound = false;
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
          muscleGroup : [
            {
              name: ''
            }
          ],
          hasWeights : true,
          basedOn: 'reps'
        }, 
        note : '',
        sets : [
            {
              repCount : null,
              weight : null,
              time : this.resetClock
            },
            {
              repCount : null,
              weight : null,
              time : this.resetClock
            },
            {
              repCount : null,
              weight : null,
              time : this.resetClock
          }
          ]
      }

      this.workout.exercise.push(shellExercise);

      // Default value is true only for the first exercise
      this.showWarmUp.push(index == 0);
    }
  }

  // async loadWorkout() {
  //   const loading = await this.loadingController.create({
  //     message: 'Loading Workout...',
  //     animated: true
  //   });
  //   await loading.present();

  //   this.appStorage.getWorkout(this.workoutId).then((storageWorkout: Workout) => {
  //     loading.dismiss();
  //     this.workout = storageWorkout;
  //   });
  // }

  async saveWorkout() {
    const loading = await this.loadingController.create({
      message: 'Saving Workout...',
      animated: true
    });
    await loading.present();
    let objectJson = JSON.parse(JSON.stringify(this.workout));
    console.log(objectJson);

    if (this.workoutId) {
      this.appStorage.updateWorkout(this.workout);
      loading.dismiss();
      this.navController.back(); 
    } else {
      this.appStorage.addWorkout(this.workout).then(() => {
        loading.dismiss();
        this.navController.navigateForward('/members/show-workout');
      })
    }
  }

  logout() {
    this.authenticationService.logout();
  }
}
