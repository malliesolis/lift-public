import { IStorageObject } from "./IStorageObject";
import { MuscleGroup } from "./MuscleGroup";
/**
 * Data model for a Exercise Type. This is used as both the persisted model and the view model.
 */
export class ExerciseType implements IStorageObject {
	/**
	 * The is the firebase storage id. This is not persisted.
	 */
	storageId?: string;

	/**
	 * A name for the exercise type. This value is persisted.
	 */
	name: string;

	/**
	 * An optional description for the group. This isn't currently used.
	 */
	description?: string;

	/**
	 * The muscle groups of the exercise that are in this exercise type. These values are persisted.
	 */
	muscleGroup: MuscleGroup[];
	
	/**
	 * What the exercise is based on (time / reps)of the exercise that are in this exercise type. These values are persisted.
	 */
	basedOn: string;

	/**
	 * True if ExerciseType has weights that are used, else false. These values are persisted.
	 */
	hasWeights: boolean;

}
