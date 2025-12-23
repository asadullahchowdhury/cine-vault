import yts from 'yts'
import axios from 'axios'

// Try multiple YTS API endpoints
const YTS_API_ENDPOINTS = [
	'https://yts.mx/api/v2',
	'https://yts.am/api/v2',
	'https://yts.ag/api/v2',
]

export interface YtsTorrent {
	url: string
	hash: string
	quality: string
	type: string
	seeds: number
	peers: number
	size: string
	size_bytes: number
	date_uploaded: string
	date_uploaded_unix: number
}

export interface YtsMovie {
	id: number
	url: string
	imdb_code: string
	title: string
	title_english: string
	title_long: string
	slug: string
	year: number
	rating: number
	runtime: number
	genres: string[]
	summary: string
	description_full: string
	synopsis: string
	yt_trailer_code: string
	language: string
	mpa_rating: string
	background_image: string
	background_image_original: string
	small_cover_image: string
	medium_cover_image: string
	large_cover_image: string
	state: string
	torrents: YtsTorrent[]
	date_uploaded: string
	date_uploaded_unix: number
}

export interface YtsMovieDetails extends YtsMovie {
	description_intro: string
	cast?: Array<{
		name: string
		character_name: string
		imdb_code: string
		url_small_image: string | null
	}>
	like_count: number
}

export interface YtsListResponse {
	status: string
	status_message: string
	data: {
		movie_count: number
		limit: number
		page_number: number
		movies: YtsMovie[]
	}
}

export interface YtsMovieResponse {
	status: string
	status_message: string
	data: {
		movie: YtsMovieDetails
	}
}

export interface YtsSearchResponse {
	status: string
	status_message: string
	data: {
		movie_count: number
		limit: number
		page_number: number
		movies: YtsMovie[]
	}
}

/**
 * Get list of movies from YTS
 */
export async function listMovies(
	options: {
		quality?: string
		genre?: string
		rating?: number
		limit?: number
		page?: number
		sort_by?: 'title' | 'year' | 'rating' | 'peers' | 'seeds' | 'download_count' | 'like_count' | 'date_added'
		order_by?: 'asc' | 'desc'
		query_term?: string
	} = {}
): Promise<YtsMovie[]> {
	try {
		// Try npm package first (it might handle DNS/connectivity better)
		const response = await yts.listMovies(options)
		
		// YTS package might return data in different formats
		if (response?.movies && Array.isArray(response.movies) && response.movies.length > 0) {
			return response.movies
		}
		if (response?.data?.movies && Array.isArray(response.data.movies) && response.data.movies.length > 0) {
			return response.data.movies
		}
		
		// If npm package returns empty, try direct API
		try {
			const data = await tryYtsApiEndpoints('/list_movies.json', options)
			if (data?.data?.movies && Array.isArray(data.data.movies)) {
				return data.data.movies
			}
		} catch (apiError) {
			console.warn('Both npm package and direct API failed')
		}
		
		return []
	} catch (error) {
		console.error('Error fetching YTS movies:', error)
		return []
	}
}

/**
 * Search movies by query
 */
export async function searchMovies(
	query: string,
	page = 1,
	limit = 20
): Promise<YtsSearchResponse['data']> {
	try {
		// Try direct API call first (more reliable)
		try {
			const data = await tryYtsApiEndpoints('/list_movies.json', {
				query_term: query,
				page,
				limit,
			})

			if (data?.data) {
				return {
					movies: data.data.movies || [],
					movie_count: data.data.movie_count || 0,
					limit: data.data.limit || limit,
					page_number: data.data.page_number || page,
				}
			}
		} catch (apiError) {
			console.warn('Direct YTS API call failed, trying npm package:', apiError)
		}

		// Fallback to npm package
		const response = await yts.listMovies({
			query_term: query,
			page,
			limit,
		})
		
		const movies = response?.movies || response?.data?.movies || []
		const movieCount = response?.movie_count || response?.data?.movie_count || 0
		const responseLimit = response?.limit || response?.data?.limit || limit
		const pageNumber = response?.page_number || response?.data?.page_number || page
		
		return {
			movies: Array.isArray(movies) ? movies : [],
			movie_count: movieCount,
			limit: responseLimit,
			page_number: pageNumber,
		}
	} catch (error) {
		console.error('Error searching YTS movies:', error)
		return {
			movies: [],
			movie_count: 0,
			limit,
			page_number: page,
		}
	}
}

/**
 * Get movie details by ID
 */
export async function getMovieDetails(movieId: number): Promise<YtsMovieDetails> {
	try {
		// Try direct API call first
		try {
			for (const baseUrl of YTS_API_ENDPOINTS) {
				try {
					const response = await axios.get(`${baseUrl}/movie_details.json`, {
						params: {
							movie_id: movieId,
							with_images: true,
							with_cast: true,
						},
						timeout: 10000,
					})

					if (response.data?.status === 'ok' && response.data?.data?.movie) {
						return response.data.data.movie as YtsMovieDetails
					}
				} catch (error) {
					// Try next endpoint
					continue
				}
			}
		} catch (apiError) {
			console.warn('Direct YTS API call failed, trying npm package:', apiError)
		}

		// Fallback to npm package
		const response = await yts.movieDetails({ movie_id: movieId })
		
		// YTS package might return the movie directly or wrapped
		if (response && typeof response === 'object') {
			if ('id' in response) {
				return response as YtsMovieDetails
			}
			if ('movie' in response && typeof response.movie === 'object' && 'id' in response.movie) {
				return response.movie as YtsMovieDetails
			}
			if ('data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
				return response.data as YtsMovieDetails
			}
		}
		
		throw new Error('Invalid response structure from YTS API')
	} catch (error) {
		console.error('Error fetching YTS movie details:', error)
		throw error
	}
}

/**
 * Get similar/suggested movies
 */
export async function getMovieSuggestions(movieId: number): Promise<YtsMovie[]> {
	try {
		const response = await yts.movieSuggestions({ movie_id: movieId })
		// YTS package returns data directly
		return response?.movies || []
	} catch (error) {
		console.error('Error fetching YTS movie suggestions:', error)
		return []
	}
}

/**
 * Get trending movies (sorted by download count)
 */
async function tryYtsApiEndpoints(
	endpoint: string,
	params: Record<string, any>
): Promise<any> {
	for (const baseUrl of YTS_API_ENDPOINTS) {
		try {
			const response = await axios.get(`${baseUrl}${endpoint}`, {
				params,
				timeout: 10000,
			})
			if (response.data?.status === 'ok') {
				return response.data
			}
		} catch (error) {
			// Try next endpoint
			continue
		}
	}
	throw new Error('All YTS API endpoints failed')
}

export async function getTrendingMovies(limit = 20): Promise<YtsMovie[]> {
	try {
		// Try npm package first (it might handle connectivity better)
		try {
			const response = await yts.listMovies({
				sort_by: 'download_count',
				order_by: 'desc',
				limit,
			})
			
			if (response?.movies && Array.isArray(response.movies) && response.movies.length > 0) {
				return response.movies
			}
			if (response?.data?.movies && Array.isArray(response.data.movies) && response.data.movies.length > 0) {
				return response.data.movies
			}
		} catch (npmError) {
			console.warn('YTS npm package failed, trying direct API:', npmError)
		}

		// Fallback to direct API call
		try {
			const data = await tryYtsApiEndpoints('/list_movies.json', {
				sort_by: 'download_count',
				order_by: 'desc',
				limit,
			})

			if (data?.data?.movies && Array.isArray(data.data.movies)) {
				return data.data.movies
			}
		} catch (apiError) {
			console.warn('Direct YTS API call also failed:', apiError)
		}
		
		return []
	} catch (error) {
		console.error('Error fetching trending YTS movies:', error)
		return []
	}
}

/**
 * Get latest movies
 */
export async function getLatestMovies(limit = 20): Promise<YtsMovie[]> {
	try {
		// Try direct API call first (more reliable)
		try {
			const response = await axios.get(`${YTS_API_BASE}/list_movies.json`, {
				params: {
					sort_by: 'date_added',
					order_by: 'desc',
					limit,
				},
				timeout: 10000,
			})

			if (response.data?.status === 'ok' && response.data?.data?.movies) {
				return response.data.data.movies
			}
		} catch (apiError) {
			console.warn('Direct YTS API call failed, trying npm package:', apiError)
		}

		// Fallback to npm package
		const response = await yts.listMovies({
			sort_by: 'date_added',
			order_by: 'desc',
			limit,
		})
		
		if (response?.movies && Array.isArray(response.movies)) {
			return response.movies
		}
		if (response?.data?.movies && Array.isArray(response.data.movies)) {
			return response.data.movies
		}
		return []
	} catch (error) {
		console.error('Error fetching latest YTS movies:', error)
		return []
	}
}

/**
 * Get top rated movies
 */
export async function getTopRatedMovies(limit = 20): Promise<YtsMovie[]> {
	try {
		// Try npm package first (it might handle connectivity better)
		try {
			const response = await yts.listMovies({
				sort_by: 'rating',
				order_by: 'desc',
				limit,
			})
			
			if (response?.movies && Array.isArray(response.movies) && response.movies.length > 0) {
				return response.movies
			}
			if (response?.data?.movies && Array.isArray(response.data.movies) && response.data.movies.length > 0) {
				return response.data.movies
			}
		} catch (npmError) {
			console.warn('YTS npm package failed, trying direct API:', npmError)
		}

		// Fallback to direct API call
		try {
			const data = await tryYtsApiEndpoints('/list_movies.json', {
				sort_by: 'rating',
				order_by: 'desc',
				limit,
			})

			if (data?.data?.movies && Array.isArray(data.data.movies)) {
				return data.data.movies
			}
		} catch (apiError) {
			console.warn('Direct YTS API call also failed:', apiError)
		}
		
		return []
	} catch (error) {
		console.error('Error fetching top rated YTS movies:', error)
		return []
	}
}

/**
 * Get movies by genre
 */
export async function getMoviesByGenre(
	genre: string,
	page = 1,
	limit = 20
): Promise<YtsSearchResponse['data']> {
	try {
		// Try direct API call first
		try {
			const data = await tryYtsApiEndpoints('/list_movies.json', {
				genre,
				page,
				limit,
			})

			if (data?.data) {
				return {
					movies: data.data.movies || [],
					movie_count: data.data.movie_count || 0,
					limit: data.data.limit || limit,
					page_number: data.data.page_number || page,
				}
			}
		} catch (apiError) {
			console.warn('Direct YTS API call failed, trying npm package:', apiError)
		}

		// Fallback to npm package
		const response = await yts.listMovies({
			genre,
			page,
			limit,
		})
		
		const movies = response?.movies || response?.data?.movies || []
		const movieCount = response?.movie_count || response?.data?.movie_count || 0
		const responseLimit = response?.limit || response?.data?.limit || limit
		const pageNumber = response?.page_number || response?.data?.page_number || page
		
		return {
			movies: Array.isArray(movies) ? movies : [],
			movie_count: movieCount,
			limit: responseLimit,
			page_number: pageNumber,
		}
	} catch (error) {
		console.error('Error fetching YTS movies by genre:', error)
		return {
			movies: [],
			movie_count: 0,
			limit,
			page_number: page,
		}
	}
}

/**
 * Get image URL from YTS movie
 * YTS provides full URLs, but they redirect from yts.mx to img.yts.mx
 * We'll normalize them to use img.yts.mx directly for better performance
 */
export function getYtsImageUrl(
	imagePath: string | null | undefined,
	size: 'small' | 'medium' | 'large' = 'medium'
): string {
	if (!imagePath) {
		return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgZmlsbD0iIzFmMWYxZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='
	}

	// YTS images redirect from yts.mx to img.yts.mx
	// Normalize to img.yts.mx for better performance
	if (imagePath.includes('yts.mx/assets/images')) {
		return imagePath.replace('yts.mx', 'img.yts.mx')
	}

	return imagePath
}

/**
 * Generate magnet link from torrent hash
 */
export function generateMagnetLink(
	hash: string,
	title: string,
	trackers: string[] = []
): string {
	const defaultTrackers = [
		'udp://tracker.openbittorrent.com:80',
		'udp://tracker.leechers-paradise.org:6969',
		'udp://tracker.coppersurfer.tk:6969',
		'udp://tracker.opentrackr.org:1337',
		'udp://explodie.org:6969',
		'udp://tracker.empire-js.us:1337',
	]

	const allTrackers = [...defaultTrackers, ...trackers]
	const trackerParams = allTrackers.map((tracker) => `tr=${encodeURIComponent(tracker)}`).join('&')

	return `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(title)}&${trackerParams}`
}

