import { HttpContext } from "@adonisjs/core/http";
import { VineValidator } from "@vinejs/vine";

export class Validator {
	static async validateRequest(
		request: HttpContext["request"],
		validator: VineValidator<any, any>,
	): Promise<any> {
		const data = request.all();
		return await validator.validate(data);
	}
}
