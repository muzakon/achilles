import ky, { HTTPError, Options as KyOptions } from "ky";
import { Exception } from "@adonisjs/core/exceptions";
import { StatusCodes } from "http-status-codes";
import logger from "@adonisjs/core/services/logger";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
	headers?: RequestInit["headers"];
	throwExceptions?: boolean;
	retry?: number;
	json?: unknown;
}

export class RequestManager {
	async generateRequest<T>(
		method: HttpMethod,
		url: string,
		options: RequestOptions = {},
	): Promise<T | null> {
		const { headers = {}, throwExceptions = true, retry = 3, json } = options;

		try {
			const kyOptions: KyOptions = {
				method,
				headers,
				retry,
				json,
			};

			logger.info(`URL: ${url} - Method: ${method}`);
			const response = await ky(url, kyOptions).json<T>();

			return response;
		} catch (error) {
			if (error instanceof HTTPError) {
				const errorText = await error.response.text();
				logger.error(new Error(errorText));
			}

			if (throwExceptions) {
				throw new Exception(
					"An error occurred when trying to process your request. Please try again later.",
					{
						status: StatusCodes.INTERNAL_SERVER_ERROR,
					},
				);
			}

			return null;
		}
	}
}
