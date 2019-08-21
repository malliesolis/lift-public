import { Exercise } from "./Exercise";
/**
 * Data model for a Workout. This is used as the persisted model and the view model.
 */
export class Workout {
	/**
	 * The is the firebase storage id. This is not persisted.
	 */
	storageId?: string;	

	/**
	 * An array of Exercises done for this Workout. These values are persisted.
	 */
	exercise: Exercise[];

	/**
	 * A date for the workout. This value is persisted.
	 */
	date: Date;

	/**
	 * A note for the exercise type. This value is persisted.
	 */
	note: string;
    
	/**
	 * The is the firebase storage id for the user. This value is persisted.
	 */
	userId: string;
}
