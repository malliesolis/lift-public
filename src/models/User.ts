import { IStorageObject } from "./IStorageObject";
/**
 * Data model for a User. This is used as both the persisted model and the view model.
 */
export class User implements IStorageObject {
	/**
	 * The is the firebase storage id. This is not persisted.
	 */
	storageId?: string;

	/**
	 * A first name for the user. This value is persisted.
	 */
	firstName: string;

	/**
	 * A last name for the user. This value is persisted.
	 */
	lastName: string;

	/**
	 * A nickname for the user. This value is persisted.
	 */
	nickname: string;

}
