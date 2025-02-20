import vine from "@vinejs/vine";
import { FieldContext } from "@vinejs/vine/types";
import { ObjectId } from "bson";

async function isValidId(
	value: unknown,
	options: string | null,
	field: FieldContext,
) {
	if (typeof value !== "string") {
		return;
	}

	if (!ObjectId.isValid(value)) {
		field.report("Format of `{{field}}` is wrong.", "isValidId", field);
	}
}

export const isValidIdRule = vine.createRule(isValidId);
