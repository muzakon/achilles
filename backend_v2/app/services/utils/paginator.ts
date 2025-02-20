export default class Paginator {
	static async paginate<T>(
		data: any[],
		total: number,
		page: number = 1,
		limit: number = 10,
	): Promise<{
		data: T[];
		total: number;
		nextPage: string | null;
		prevPage: string | null;
	}> {
		// Pagination metadata
		const hasNextPage = page * limit < total;
		const hasPrevPage = page > 1;
		const nextPage = hasNextPage ? `page=${page + 1}&limit=${limit}` : null;
		const prevPage = hasPrevPage ? `page=${page - 1}&limit=${limit}` : null;

		return {
			data,
			total,
			nextPage,
			prevPage,
		};
	}
}
