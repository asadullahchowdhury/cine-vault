declare module 'yts' {
	interface YtsListOptions {
		quality?: string
		genre?: string
		rating?: number
		limit?: number
		page?: number
		sort_by?: string
		order_by?: 'asc' | 'desc'
		query_term?: string
	}

	interface YtsMovieDetailsOptions {
		movie_id: number
	}

	interface YtsMovieSuggestionsOptions {
		movie_id: number
	}

	interface YtsResponse {
		movies?: any[]
		movie?: any
		movie_count?: number
		limit?: number
		page_number?: number
	}

	const yts: {
		listMovies(options?: YtsListOptions): Promise<YtsResponse>
		movieDetails(options: YtsMovieDetailsOptions): Promise<any>
		movieSuggestions(options: YtsMovieSuggestionsOptions): Promise<YtsResponse>
	}

	export default yts
}

