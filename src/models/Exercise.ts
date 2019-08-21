import { Set } from "./Set";
import { ExerciseType } from "./ExerciseType";
/**
 * Data model for a Exercise. This is used as the view model. There's not persisted model.
 */
export class Exercise {

	/**
	 * The sets in the Exercise storage ids of the players that are in this group. These values are persisted.
	 */
	exerciseType: ExerciseType;

	/**
	 * A note for the exercise type. This value is persisted.
	 */
	note: string;
    
	/**
	 * The sets in the Exercise storage ids of the players that are in this group. These values are persisted.
	 */
	sets: Set[];
}
