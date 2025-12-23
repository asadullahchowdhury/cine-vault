import axios from 'axios'

/**
 * TMDB API Client
 * 
 * NOTE: This module is now primarily for TV shows only.
 * For movies, use the YTS API (lib/api/yts.ts) instead.
 * Movie functions below are kept for backward compatibility but are deprecated.
 */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || ''
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export interface TmdbConfiguration {
	images: {
		base_url: string
		secure_base_url: string
		backdrop_sizes: string[]
		logos_sizes: string[]
		poster_sizes: string[]
		profile_sizes: string[]
		still_sizes: string[]
	}
	change_keys: string[]
}

// Cache for TMDB configuration
let tmdbConfig: TmdbConfiguration | null = null
let configLoadingPromise: Promise<TmdbConfiguration> | null = null

// Default fallback configuration
const defaultConfig: TmdbConfiguration = {
	images: {
		base_url: 'http://image.tmdb.org/t/p/',
		secure_base_url: 'https://image.tmdb.org/t/p/',
		backdrop_sizes: ['w300', 'w780', 'w1280', 'original'],
		logos_sizes: ['w45', 'w92', 'w154', 'w185', 'w300', 'w500', 'original'],
		poster_sizes: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
		profile_sizes: ['w45', 'w185', 'h632', 'original'],
		still_sizes: ['w92', 'w185', 'w300', 'original'],
	},
	change_keys: [],
}

export interface TmdbMovie {
	id: number
	title: string
	overview: string
	poster_path: string | null
	backdrop_path: string | null
	release_date: string
	vote_average: number
	vote_count: number
	genre_ids: number[]
	popularity: number
	media_type?: 'movie' | 'tv'
}

export interface TmdbTvShow {
	id: number
	name: string
	overview: string
	poster_path: string | null
	backdrop_path: string | null
	first_air_date: string
	vote_average: number
	vote_count: number
	genre_ids: number[]
	popularity: number
	media_type?: 'movie' | 'tv'
}

export interface TmdbGenre {
	id: number
	name: string
}

export interface TmdbCast {
	id: number
	name: string
	character: string
	profile_path: string | null
	order: number
}

export interface TmdbCrew {
	id: number
	name: string
	job: string
	profile_path: string | null
}

export interface TmdbMovieDetails extends TmdbMovie {
	genres: TmdbGenre[]
	runtime: number
	budget: number
	revenue: number
	credits?: {
		cast: TmdbCast[]
		crew: TmdbCrew[]
	}
	videos?: {
		results: Array<{
			key: string
			type: string
			site: string
		}>
	}
	similar?: {
		results: TmdbMovie[]
	}
}

export interface TmdbTvDetails extends TmdbTvShow {
	genres: TmdbGenre[]
	number_of_seasons: number
	number_of_episodes: number
	credits?: {
		cast: TmdbCast[]
		crew: TmdbCrew[]
	}
	videos?: {
		results: Array<{
			key: string
			type: string
			site: string
		}>
	}
	similar?: {
		results: TmdbTvShow[]
	}
}

export interface TmdbSearchResponse {
	page: number
	results: (TmdbMovie | TmdbTvShow)[]
	total_pages: number
	total_results: number
}

const tmdbClient = axios.create({
	baseURL: TMDB_BASE_URL,
	params: {
		api_key: TMDB_API_KEY,
	},
	timeout: 10000,
})

// Add response interceptor to handle errors
tmdbClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			if (!TMDB_API_KEY) {
				const errorMessage =
					'TMDB API key is missing. Please set NEXT_PUBLIC_TMDB_API_KEY in your .env file.'
				console.error('❌', errorMessage)
				throw new Error(errorMessage)
			} else {
				const errorMessage =
					'TMDB API key is invalid. Please check your NEXT_PUBLIC_TMDB_API_KEY in your .env file.'
				console.error('❌', errorMessage)
				throw new Error(errorMessage)
			}
		}
		throw error
	}
)

/**
 * Fetches and caches TMDB configuration
 * This should be called early in the app lifecycle to ensure config is available
 */
export async function getTmdbConfiguration(): Promise<TmdbConfiguration> {
	// Return cached config if available
	if (tmdbConfig) {
		return tmdbConfig
	}

	// Return existing loading promise if config is being fetched
	if (configLoadingPromise) {
		return configLoadingPromise
	}

	// Start fetching configuration
	configLoadingPromise = (async () => {
		if (!TMDB_API_KEY) {
			console.warn('⚠️  TMDB API key is missing. Using default configuration.')
			tmdbConfig = defaultConfig
			return defaultConfig
		}

		try {
			const { data } = await tmdbClient.get<TmdbConfiguration>('/configuration')
			tmdbConfig = data
			configLoadingPromise = null
			return data
		} catch (error) {
			console.error('Error fetching TMDB configuration:', error)
			// Use default config on error
			tmdbConfig = defaultConfig
			configLoadingPromise = null
			return defaultConfig
		}
	})()

	return configLoadingPromise
}

/**
 * Gets the current TMDB configuration (synchronous)
 * Returns cached config or default if not loaded yet
 */
function getConfigSync(): TmdbConfiguration {
	return tmdbConfig || defaultConfig
}

/**
 * Gets image URL using TMDB configuration
 * Validates image size based on image type
 */
export function getImageUrl(
	path: string | null,
	size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500',
	type: 'poster' | 'backdrop' | 'profile' | 'logo' | 'still' = 'poster'
): string {
	if (!path) {
		return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgZmlsbD0iIzFmMWYxZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='
	}

	const config = getConfigSync()
	const baseUrl = config.images.secure_base_url

	// Get valid sizes based on image type
	let validSizes: string[]
	switch (type) {
		case 'poster':
			validSizes = config.images.poster_sizes
			break
		case 'backdrop':
			validSizes = config.images.backdrop_sizes
			break
		case 'profile':
			validSizes = config.images.profile_sizes
			break
		case 'logo':
			validSizes = config.images.logos_sizes
			break
		case 'still':
			validSizes = config.images.still_sizes
			break
		default:
			validSizes = config.images.poster_sizes
	}

	// Validate and use the size, fallback to 'original' if invalid
	const validSize = validSizes.includes(size) ? size : 'original'

	return `${baseUrl}${validSize}${path}`
}

/**
 * @deprecated Use YTS API (getTrendingMovies from lib/api/yts.ts) for movies instead
 * This function is kept for TV shows compatibility only
 */
export async function getTrendingMovies(
	timeWindow: 'day' | 'week' = 'day'
): Promise<TmdbMovie[]> {
	if (!TMDB_API_KEY) {
		console.warn('⚠️  TMDB API key is missing. Returning empty results.')
		return []
	}

	try {
		const { data } = await tmdbClient.get<{ results: TmdbMovie[] }>(
			`/trending/movie/${timeWindow}`
		)
		return data.results
	} catch (error) {
		console.error('Error fetching trending movies:', error)
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			return []
		}
		throw error
	}
}

export async function getTrendingTvShows(
	timeWindow: 'day' | 'week' = 'day'
): Promise<TmdbTvShow[]> {
	try {
		const { data } = await tmdbClient.get<{ results: TmdbTvShow[] }>(
			`/trending/tv/${timeWindow}`
		)
		return data.results
	} catch (error) {
		console.error('Error fetching trending TV shows:', error)
		throw error
	}
}

/**
 * @deprecated Use YTS API (getTopRatedMovies from lib/api/yts.ts) for movies instead
 * This function is kept for TV shows compatibility only
 */
export async function getTopRatedMovies(page = 1): Promise<{
	results: TmdbMovie[]
	total_pages: number
}> {
	if (!TMDB_API_KEY) {
		console.warn('⚠️  TMDB API key is missing. Returning empty results.')
		return { results: [], total_pages: 0 }
	}

	try {
		const { data } = await tmdbClient.get<{
			results: TmdbMovie[]
			total_pages: number
		}>('/movie/top_rated', {
			params: { page },
		})
		return data
	} catch (error) {
		console.error('Error fetching top rated movies:', error)
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			return { results: [], total_pages: 0 }
		}
		throw error
	}
}

export async function getTopRatedTvShows(page = 1): Promise<{
	results: TmdbTvShow[]
	total_pages: number
}> {
	try {
		const { data } = await tmdbClient.get<{
			results: TmdbTvShow[]
			total_pages: number
		}>('/tv/top_rated', {
			params: { page },
		})
		return data
	} catch (error) {
		console.error('Error fetching top rated TV shows:', error)
		throw error
	}
}

/**
 * @deprecated Use YTS API (getLatestMovies from lib/api/yts.ts) for movies instead
 * This function is kept for TV shows compatibility only
 */
export async function getUpcomingMovies(page = 1): Promise<{
	results: TmdbMovie[]
	total_pages: number
}> {
	if (!TMDB_API_KEY) {
		console.warn('⚠️  TMDB API key is missing. Returning empty results.')
		return { results: [], total_pages: 0 }
	}

	try {
		const { data } = await tmdbClient.get<{
			results: TmdbMovie[]
			total_pages: number
		}>('/movie/upcoming', {
			params: { page },
		})
		return data
	} catch (error) {
		console.error('Error fetching upcoming movies:', error)
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			return { results: [], total_pages: 0 }
		}
		throw error
	}
}

/**
 * @deprecated Use YTS API (searchMovies from lib/api/yts.ts) for movies instead
 * This function is kept for TV shows compatibility only
 */
export async function searchMovies(
	query: string,
	page = 1,
	includeAdult = false
): Promise<TmdbSearchResponse> {
	try {
		const { data } = await tmdbClient.get<TmdbSearchResponse>(
			'/search/movie',
			{
				params: {
					query,
					page,
					include_adult: includeAdult,
				},
			}
		)
		return data
	} catch (error) {
		console.error('Error searching movies:', error)
		throw error
	}
}

export async function searchTvShows(
	query: string,
	page = 1
): Promise<TmdbSearchResponse> {
	try {
		const { data } = await tmdbClient.get<TmdbSearchResponse>(
			'/search/tv',
			{
				params: {
					query,
					page,
				},
			}
		)
		return data
	} catch (error) {
		console.error('Error searching TV shows:', error)
		throw error
	}
}

export async function searchMulti(
	query: string,
	page = 1
): Promise<TmdbSearchResponse> {
	try {
		const { data } = await tmdbClient.get<TmdbSearchResponse>(
			'/search/multi',
			{
				params: {
					query,
					page,
				},
			}
		)
		return data
	} catch (error) {
		console.error('Error searching multi:', error)
		throw error
	}
}

/**
 * @deprecated Use YTS API (getMovieDetails from lib/api/yts.ts) for movies instead
 * This function is kept for TV shows compatibility only
 */
export async function getMovieDetails(
	id: number
): Promise<TmdbMovieDetails> {
	try {
		const { data } = await tmdbClient.get<TmdbMovieDetails>(
			`/movie/${id}`,
			{
				params: {
					append_to_response: 'credits,videos,similar',
				},
			}
		)
		return data
	} catch (error) {
		console.error('Error fetching movie details:', error)
		throw error
	}
}

export async function getTvDetails(id: number): Promise<TmdbTvDetails> {
	try {
		const { data } = await tmdbClient.get<TmdbTvDetails>(`/tv/${id}`, {
			params: {
				append_to_response: 'credits,videos,similar',
			},
		})
		return data
	} catch (error) {
		console.error('Error fetching TV details:', error)
		throw error
	}
}

export async function getGenres(
	type: 'movie' | 'tv' = 'movie'
): Promise<TmdbGenre[]> {
	try {
		const { data } = await tmdbClient.get<{ genres: TmdbGenre[] }>(
			`/genre/${type}/list`
		)
		return data.genres
	} catch (error) {
		console.error('Error fetching genres:', error)
		throw error
	}
}

/**
 * @deprecated Use YTS API (getMoviesByGenre from lib/api/yts.ts) for movies instead
 * This function is kept for TV shows compatibility only
 */
export async function getMoviesByGenre(
	genreId: number,
	page = 1
): Promise<{
	results: TmdbMovie[]
	total_pages: number
}> {
	try {
		const { data } = await tmdbClient.get<{
			results: TmdbMovie[]
			total_pages: number
		}>('/discover/movie', {
			params: {
				with_genres: genreId,
				page,
			},
		})
		return data
	} catch (error) {
		console.error('Error fetching movies by genre:', error)
		throw error
	}
}

export async function getTvByGenre(
	genreId: number,
	page = 1
): Promise<{
	results: TmdbTvShow[]
	total_pages: number
}> {
	try {
		const { data } = await tmdbClient.get<{
			results: TmdbTvShow[]
			total_pages: number
		}>('/discover/tv', {
			params: {
				with_genres: genreId,
				page,
			},
		})
		return data
	} catch (error) {
		console.error('Error fetching TV by genre:', error)
		throw error
	}
}

