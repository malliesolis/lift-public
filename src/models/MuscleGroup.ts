import { IStorageObject } from "./IStorageObject";
/**
 * Data model for a muscle group. This is used as both the persisted model and the view model.
 */
export class MuscleGroup implements IStorageObject {
	/**
	 * The is the firebase storage id. This is not persisted.
	 */
	storageId?: string;

	/**
	 * A name for the muscle group. This value is persisted.
	 */
	name: string;

	/**
	 * An optional description for the group. This isn't currently used.
	 */
	description?: string;

}
