/* eslint-disable prettier/prettier */
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateCompanyValidator {
	constructor(protected ctx: HttpContextContract) { }

	/*
	* Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
	*
	* For example:
	* 1. The username must be of data type string. But then also, it should
	*    not contain special characters or numbers.
	*    ```
	*     schema.string({}, [ rules.alpha() ])
	*    ```
	*
	* 2. The email must be of data type string, formatted as a valid
	*    email. But also, not used by any other user.
	*    ```
	*     schema.string({}, [
	*       rules.email(),
	*       rules.unique({ table: 'users', column: 'email' }),
	*     ])
	*    ```
	*/
	public schema = schema.create({
		category_id: schema.number.optional([
			rules.exists({ table: 'company_categories', column: 'id' })
		]),
		title: schema.string({ trim: true }, [
			rules.required()
		]),
		description: schema.string.optional({ trim: true }),
		status: schema.boolean([rules.required()]),
		image: schema.file.optional({
			size: '5mb',
			extnames: ['jpg', 'gif', 'png'],
		}),
	})

	/**
	 * Custom messages for validation failures. You can make use of dot notation `(.)`
	 * for targeting nested fields and array expressions `(*)` for targeting all
	 * children of an array. For example:
	 *
	 * {
	 *   'profile.username.required': 'Username is required',
	 *   'scores.*.number': 'Define scores as valid numbers'
	 * }
	 *
	 */
	public messages = {}
}
