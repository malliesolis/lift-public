import  { firestore } from 'firebase/app';
import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { Workout } from '../../models/Workout';
import { ExerciseType } from '../../models/ExerciseType';
import { MuscleGroup } from '../../models/MuscleGroup';
import { IStorageObject } from '../../models/IStorageObject';
import { User } from 'src/models/User';

/**
 * The persistent data storage, as an Angular service, for the application.
 * This currently uses firebase.
 *
 * @export
 * @class AppStorage
 */
@Injectable()
export class AppStorage {
	// The firebase storage collections for the different data types.
	private readonly exerciseTypesCollection: string = "exercise-type";
	private readonly workoutsCollection: string = "workouts";
	private readonly muscleGroupsCollection: string = "muscle-group";
	private readonly usersCollection: string = "users";

    private breakException: ExceptionInformation = {};

    private database: firestore.Firestore;

	// Local caches for the players and groups.
    private exerciseTypeCache: ExerciseType[];
    private muscleGroupCache: MuscleGroup[];
    private workoutCache: Workout[];
    private userCache: User[];

    constructor() {
        this.database = firebase.firestore();
        let settings: firestore.Settings = {
            timestampsInSnapshots: true
        };
        this.database.settings(settings);

        this.exerciseTypeCache = [];
        this.muscleGroupCache = [];
        this.workoutCache = [];
        this.userCache = [];
    }

  /**
	 * Retrieve the persisted exerciseTypes from the cache or storage.
	 *
	 * @param {boolean} [refresh=false] Force refreshing the exerciseTypes from storage
	 * if this is true.
	 * @returns {Promise<ExerciseType[]>} The Promise with the collection of exerciseTypes from
	 * the cache or storage.
	 * @memberof AppStorage
	 */
	public getExerciseTypes(refresh: boolean = false): Promise<ExerciseType[]> {
    if(!refresh && this.muscleGroupCache.length > 0) {
        return Promise.resolve(this.exerciseTypeCache);
    }

    return this.getObjects<ExerciseType>(this.exerciseTypesCollection, 'exerciseTypeCache');
  }

  /**
	 * Retrieve the persisted muscle groups from the cache or storage.
	 *
	 * @param {boolean} [refresh=false] Force refreshing the muscle groups from storage
	 * if this is true.
	 * @returns {Promise<MuscleGroup[]>} The Promise with the collection of muscle groups from
	 * the cache or storage.
	 * @memberof AppStorage
	 */
	public getMuscleGroups(refresh: boolean = false): Promise<MuscleGroup[]> {
    if(!refresh && this.muscleGroupCache.length > 0) {
        return Promise.resolve(this.muscleGroupCache);
    }

    return this.getObjects<MuscleGroup>(this.muscleGroupsCollection, 'muscleGroupCache');
  }    
  
  /**
	 * Retrieve the workouts from the cache or storage.
	 *
	 * @param {boolean} [refresh=false] If true, forces a reload of the workouts from
	 * storage.
	 * @returns {Promise<Workout[]>} The workouts from the cache or storage.
	 * @memberof AppStorage
	 */
	public getWorkouts(refresh: boolean = false): Promise<Workout[]> {
    if(!refresh && this.workoutCache.length > 0) {
        return Promise.resolve(this.workoutCache);
    }

    return this.getObjects<Workout>(this.workoutsCollection, 'workoutCache');
  }  

  /**
	 * Retrieve the persisted users from the cache or storage.
	 *
	 * @param {boolean} [refresh=false] Force refreshing the users from storage
	 * if this is true.
	 * @returns {Promise<User[]>} The Promise with the collection of users from
	 * the cache or storage.
	 * @memberof AppStorage
	 */
	public getUsers(refresh: boolean = false): Promise<User[]> {
    if(!refresh && this.userCache.length > 0) {
        return Promise.resolve(this.userCache);
    }

    return this.getObjects<User>(this.usersCollection, 'userCache');
}    


  /**
   * Adds a exerciseType to storage. This will not add a exerciseTypes if a exerciseTypes
   * already exists with the same name.
   *
   * @param {ExerciseType} exerciseType The exerciseTypes to persist.
   * @returns {Promise<ExerciseType>} The exerciseTypes that was added to storage. This should
   * have the storageId for the new exerciseTypes.
   * @memberof AppStorage
   */
  public addExerciseType(exerciseType: ExerciseType): Promise<ExerciseType> {
      let matchingExerciseType: ExerciseType = this.exerciseTypeCache.find((et: ExerciseType) => {
          return (et.storageId && et.storageId === exerciseType.storageId)
              || (et.name === exerciseType.name);
      });

      if(!matchingExerciseType) {
          return this.addObject<ExerciseType>( this.exerciseTypesCollection, exerciseType);
      }
  }

  /**
   * Adds a musclegroup to storage. This will not add a musclegroup if a musclegroup
   * already exists with the same name.
   *
   * @param {MuscleGroup} muscleGroup The exerciseTypes to persist.
   * @returns {Promise<ExerciseType>} The exerciseTypes that was added to storage. This should
   * have the storageId for the new exerciseTypes.
   * @memberof AppStorage
   */
  public addMuscleGroup(muscleGroup: MuscleGroup): Promise<MuscleGroup> {
    let matchingMuscleGroup: MuscleGroup = this.muscleGroupCache.find((mg: MuscleGroup) => {
        return (mg.storageId && mg.storageId === muscleGroup.storageId)
            || (mg.name === muscleGroup.name);
    });

    if(!matchingMuscleGroup) {
        return this.addObject<MuscleGroup>( this.muscleGroupsCollection, muscleGroup);
    }
  }

  /**
	 * Add a workout to storage. 
	 *
	 * @param {Workout} workout The workout to persist.
	 * @returns {Promise<Workout>} The persisted workout with its storageId.
	 * @memberof AppStorage
	 */
	public addWorkout(workout: Workout): Promise<Workout> {
    return this.addObject<Workout>( this.workoutsCollection, workout );
	}

  /**
	 * Adds a user to storage. This will not add a user if a user
	 * already exists with the same first and last name.
	 *
	 * @param {User} user The user to persist.
	 * @returns {Promise<User>} The user that was added to storage. This should
	 * have the storageId for the new user.
	 * @memberof AppStorage
	 */
	public addPlayer(user: User): Promise<User> {
    let matchingUser: User = this.userCache.find((u: User) => {
        return (u.storageId && u.storageId === user.storageId)
            || (u.firstName === user.firstName && u.lastName === user.lastName);
    });

    if(!matchingUser) {
        return this.addObject<User>( this.usersCollection, user);
    }
  }

  /**
	 * Update the persisted data for a exerciseType.
	 *
	 * @param {ExerciseType} exerciseType The exerciseType to update.
	 * @memberof AppStorage
	 */
	public updateExerciseType(exerciseType: ExerciseType): void {
		let storageExerciseType: ExerciseType = {
      name: exerciseType.name,
      basedOn: exerciseType.basedOn,
      hasWeights: exerciseType.hasWeights,
      muscleGroup: exerciseType.muscleGroup
		};

		this.updateObject<ExerciseType>(exerciseType, storageExerciseType, this.exerciseTypesCollection);
	}

	/**
	 * Update the persisted data for a muscleGroup.
	 *
	 * @param {MuscleGroup} muscleGroup The muscleGroup to update.
	 * @memberof AppStorage
	 */
	public updateMuscleGroup(muscleGroup: MuscleGroup): void {
		let storageMuscleGroup: MuscleGroup = {
      name: muscleGroup.name,
		};

		this.updateObject<MuscleGroup>(muscleGroup, storageMuscleGroup, this.muscleGroupsCollection);
	}

	/**
	 * Update the persisted data for a workout.
	 *
	 * @param {Workout} workout The workout to update.
	 * @memberof AppStorage
	 */
	public updateWorkout(workout: Workout): void {
		// We only want to store the properties we need.
		let storageWorkout: Workout = {
      exercise: workout.exercise,
      date: workout.date,
      note: workout.note,
      userId: workout.userId
		}

		this.updateObject<Workout>(workout, storageWorkout, this.workoutsCollection);
	}

	/**
	 * Update the persisted data for a user.
	 *
	 * @param {User} user The user to update.
	 * @memberof AppStorage
	 */
	public updateUser(user: User): void {
		let storageUser: User = {
      firstName: user.firstName,
      lastName: user.lastName,
      nickname: user.nickname
		};

		this.updateObject<User>(user, storageUser, this.usersCollection);
	}

	/**
	 * Update an IStorageObject in storage.
	 *
	 * @private
	 * @template T
	 * @param {T} object The original object to update.
	 * @param {T} storageObject The object stripped down to just persisted properties.
	 * @param {string} collection The storage collection this object belongs to.
	 * @memberof AppStorage
	 */
	private updateObject<T extends IStorageObject>(object: T, storageObject: T, collection: string) {
		this.database.collection(collection).doc(object.storageId).set(storageObject).catch((reason: any) => {
			console.error(`Unable to update the item in storage with id ${object.storageId}. Error: ${reason}`);
		});
	}

	/**
	 * Get the workouts for a user.
	 *
	 * @param {User} user The user to retrieve the workouts for.
	 * @returns {Promise<Workout[]>} The workouts for the user.
	 * @memberof AppStorage
	 */
	public getWorkoutsForUser(user: User): Promise<Workout[]> {
		if(this.workoutCache.length === 0) {
			return this.getWorkouts().then((workouts: Workout[]) => {
				return this.getWorkoutsForUserViaCache(workouts, user.storageId);
			});
		}
		else {
			return this.getWorkoutsForUserViaCache(this.workoutCache, user.storageId);
		}
	}

	/**
	 * Get the workouts for a user from the cache.
	 *
	 * @private
	 * @param {Workout[]} workouts The workouts to get the user.
	 * @param {string} userId The userId for th user to get the workouts for.
	 * @returns {Promise<Workout[]>} The loaded workouts for the user.
	 * @memberof AppStorage
	 */
	private getWorkoutsForUserViaCache(workouts: Workout[], userId: string): Promise<Workout[]> {
		let workoutsForUser: Workout[] = [];
		workouts.forEach((workout: Workout) => {
      if(workout.userId === userId) {
        workoutsForUser.push(workout);
      }
		});

		return Promise.resolve(workoutsForUser);
  }
  
  /**
	 * Persists an object to storage.
	 *
	 * @private
	 * @template T
	 * @param {string} collection The name of the collection to store the object to.
	 * @param {T} objectToAdd The object to persist to storage.
	 * @returns {Promise<T>} The Promise with the stored object. This should contain
	 * the storage id.
	 * @memberof AppStorage
	 */
	private addObject<T extends IStorageObject>(collection: string, objectToAdd: T): Promise<T> {
        let objectJson = JSON.parse(JSON.stringify(objectToAdd));
        return this.database.collection(collection).add(objectJson).then((docRef: firestore.DocumentReference): T => {
            objectToAdd.storageId = docRef.id
            return objectToAdd;
        }).catch((reason: any): T => {
            console.error(`Error adding object to ${collection} firebase collection. Error: ${reason}`);
            return null;
        });
    }

/**
	 * Retrieves an array of objects from storage.
	 *
	 * @private
	 * @template T
	 * @param {string} collection The storage collection to retrieve the objects from.
	 * @param {string} cachePropertyName The name of the cache to store these objects to.
	 * @returns {Promise<T[]>}
	 * @memberof AppStorage
	 */
	private getObjects<T extends IStorageObject>(collection: string, cachePropertyName: string): Promise<T[]> {
        return this.database.collection(collection).get().then((results: firebase.firestore.QuerySnapshot): T[] => {
            this[cachePropertyName] = [];
            results.forEach((snapshot: firebase.firestore.QueryDocumentSnapshot) => {
                let rawPlayerData: firebase.firestore.DocumentData = snapshot.data();
                let object: any = {};
                for (let property in rawPlayerData) {
                    object[property] = rawPlayerData[property];
                }

                object.storageId = snapshot.id;
                this[cachePropertyName].push(object);
            });

            return this[cachePropertyName];
        }).catch((reason: any): T[]=> {
            console.error("Error querying the database for players. Error: ", reason);
            return [];
        });
    }

  /**
	 * Delete the data for a exerciseType.
	 *
	 * @param {ExerciseType} exerciseType The exerciseType to delete.
	 * @memberof AppStorage
	 */
	public deleteExerciseType(exerciseType: ExerciseType): void {

		this.getExerciseTypes().then((exerciseTypes: ExerciseType[]) => {

      exerciseTypes.forEach((et : ExerciseType) => {
        if(et.storageId === exerciseType.storageId) {
          this.deleteObject<ExerciseType>(exerciseType, this.exerciseTypesCollection);
        }
      });

    }).catch((reason: any) => {
			console.error(`There was an error loading the exerciseTypes. Error ${reason}. Did not delete exerciseType.`);
		});
	}

  /**
	 * Delete the data for a muscleGroup.
	 *
	 * @param {MuscleGroup} muscleGroup The muscleGroup to delete.
	 * @memberof AppStorage
	 */
	public deleteMuscleGroup(muscleGroup: MuscleGroup): void {

		this.getMuscleGroups().then((muscleGroups: MuscleGroup[]) => {

      muscleGroups.forEach((mg : MuscleGroup) => {
        if(mg.storageId === muscleGroup.storageId) {
          this.deleteObject<MuscleGroup>(muscleGroup, this.muscleGroupsCollection);
        }
      });

    }).catch((reason: any) => {
			console.error(`There was an error loading the muscleGroups. Error ${reason}. Did not delete muscleGroup.`);
		});
  }

  /**
	 * Delete the data for a workout.
	 *
	 * @param {Workout} workout The workout to delete.
	 * @memberof AppStorage
	 */
	public deleteWorkout(workout: Workout): void {

		this.getWorkouts(true).then((workouts: Workout[]) => {

		workouts.forEach((w : Workout) => {
			if(w.storageId === workout.storageId) {
				this.deleteObject<Workout>(workout, this.workoutsCollection);
			}
		});

		}).catch((reason: any) => {
				console.error(`There was an error loading the workouts. Error ${reason}. Did not delete workout.`);
		});
	}

  /**
	 * Delete the data for a user.
	 *
	 * @param {User} user The user to delete.
	 * @memberof AppStorage
	 */
	public deleteUser(user: User): void {

		this.getUsers().then((users: User[]) => {

      users.forEach((u : User) => {
        if(u.storageId === user.storageId) {
          this.deleteObject<User>(user, this.usersCollection);
        }
      });

    }).catch((reason: any) => {
			console.error(`There was an error loading the users. Error ${reason}. Did not delete user.`);
		});
  }

	/**
	 * Delete an IStorageObject in storage.
	 *
	 * @private
	 * @template T
	 * @param {T} object The original object to delete
	 * @param {string} collection The storage collection this object belongs to.
	 * @memberof AppStorage
	 */
	private deleteObject<T extends IStorageObject>(object: T, collection: string) {
		this.database.collection(collection).doc(object.storageId).delete().then(function() {
			console.log(`Item successfully deleted.`);
		}).catch(function(reason) {
			console.error(`Unable to DELETE the item in storage with id ${object.storageId}. Error: ${reason}`);
		})
	}

}





// import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { Workout } from 'src/models/Workout';
// import { MuscleGroup } from 'src/models/MuscleGroup';
// import { IStorageObject } from 'src/models/IStorageObject';
// import { ExerciseType } from 'src/models/ExerciseType';


// @Injectable({
//   providedIn: 'root'
// })

// export class AppStorage {

//   private WorkoutsCollection: AngularFirestoreCollection<Workout>;
//   private workouts: Observable<Workout[]>;

//   private MuscleGroupCollection: AngularFirestoreCollection<MuscleGroup>;
//   private muscleGroups: Observable<MuscleGroup[]>;

//   private ExerciseTypeCollection: AngularFirestoreCollection<ExerciseType>;
//   private exerciseTypes: Observable<ExerciseType[]>;

//   constructor(angularFirestore: AngularFirestore) { 
//     this.WorkoutsCollection = angularFirestore.collection<Workout>('workouts');

//     // Listens to the changes in the database for Workouts
//     this.workouts = this.WorkoutsCollection.snapshotChanges().pipe(
//       map(actions => {
//         return actions.map(a => {
//           const data = a.payload.doc.data();
//           const id = a.payload.doc.id;
//           return { id, ...data };
//         });
//       })
//     );

//     this.MuscleGroupCollection = angularFirestore.collection<MuscleGroup>('muscle-group');

//     // Listens to the changes in the database for Muscle Group
//     this.muscleGroups = this.MuscleGroupCollection.snapshotChanges().pipe(
//       map(actions => {
//         return actions.map(a => {
//           const data = a.payload.doc.data();
//           const id = a.payload.doc.id;
//           return { id, ...data };
//         });
//       })
//     );

//     this.ExerciseTypeCollection = angularFirestore.collection<ExerciseType>('exercise-type');

//     // Listens to the changes in the database for Muscle Group
//     this.exerciseTypes = this.ExerciseTypeCollection.snapshotChanges().pipe(
//       map(actions => {
//         return actions.map(a => {
//           const data = a.payload.doc.data();
//           const id = a.payload.doc.id;
//           return { id, ...data };
//         });
//       })
//     );

//   }

//   // Returns Observable array of Workouts, no matter the user
//   getWorkouts() : Observable<Workout[]> {
//     return this.workouts;
//   }

//   // Returns specific Workout
//   getWorkout(id) : Observable<Workout> {
//     return this.WorkoutsCollection.doc<Workout>(id).valueChanges();
//   }

//   // TODO Returns array of Workouts, for specific user
//   getWorkoutsforUser(userId : string) {
//   }

//   // Returns Observable array of MuscleGroup
//   getMuscleGroups() : Observable<MuscleGroup[]> {
//     return this.muscleGroups;
//   }

//   // Deletes ExerciseType from collection
//   removeExerciseType(id) {
//     return this.ExerciseTypeCollection.doc(id).delete();
//   }

//   // Deletes MuscleGroup from collection
//   removeMuscleGroup(id) {
//     return this.MuscleGroupCollection.doc(id).delete();
//   }
  
//   // Deletes Workout from collection
//   removeWorkout(id) {
//     return this.WorkoutsCollection.doc(id).delete();
//   }

//   /**
// 	 * Persists an object to storage.
// 	 *
// 	 * @private
// 	 * @template T
// 	 * @param {AngularFirestoreCollection} collection The storage collection this object belongs to.
// 	 * @param {T} objectToAdd The object to persist to storage.
// 	 * @returns {Observable<T>} The Observable with the stored object. This should contain
// 	 * the storage id.
// 	 * @memberof AppStorage
// 	 */
// 	private addObject<T extends IStorageObject>(collection: AngularFirestoreCollection, objectToAdd: T) : Promise<DocumentReference> {
//     let objectJson = JSON.parse(JSON.stringify(objectToAdd));
//     return collection.add(objectJson);
// }

//   // Adds ExerciseType to collection
//   addExerciseType (exerciseType: ExerciseType) : Promise<DocumentReference> {
//     return this.addObject(this.ExerciseTypeCollection, exerciseType);
//   }

//   // Adds MuscleGroup to collection
//   addMuscleGroup (muscleGroup: MuscleGroup) : Promise<DocumentReference>  {
//     return this.addObject(this.MuscleGroupCollection, muscleGroup);
//   }

//   // Adds Workout to collection
//   addWorkout (workout: Workout) : Promise<DocumentReference>  {
//     return this.addObject(this.WorkoutsCollection, workout);
//   }

//   /**
// 	 * Update an IStorageObject in storage.
// 	 *
// 	 * @private
// 	 * @template T
// 	 * @param {T} object The original object to update.
//    * @param {string} id The id of the original object to update
// 	 * @param {AngularFirestoreCollection} collection The storage collection this object belongs to.
// 	 * @memberof AppStorage
// 	 */
// 	private updateObject<T extends IStorageObject>(object: T, id: string, collection: AngularFirestoreCollection<T>) {
//     let objectJson = JSON.parse(JSON.stringify(object));
//     return collection.doc<T>(id).update(objectJson);
//   }
  
//   // Updates information for specific Workout
//   updateExerciseType(exerciseType: ExerciseType, id: string) {
//     this.updateObject(exerciseType, id, this.ExerciseTypeCollection);
//   }

//   // Updates information for specific MuscleGroup
//   updateMuscleGroup(muscleGroup: MuscleGroup, id: string) {
//     this.updateObject(muscleGroup, id, this.MuscleGroupCollection);
//   }

//   // Updates information for specific Workout
//   updateWorkout(workout: Workout, id: string) {
//     this.updateObject(workout, id, this.WorkoutsCollection);
//   }


// }
