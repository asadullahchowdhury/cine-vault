import { NextRequest, NextResponse } from 'next/server'
import { listMovies } from '@/lib/api/yts'

// Cache genres to avoid repeated API calls
let genresCache: Array<{ id: string; name: string }> | null = null
let genresCacheTime: number = 0
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour

export async function GET(request: NextRequest) {
	try {
		// Return cached genres if available and not expired
		const now = Date.now()
		if (genresCache && genresCacheTime && now - genresCacheTime < CACHE_DURATION) {
			return NextResponse.json(genresCache, { status: 200 })
		}

		// Fetch a large sample of movies to extract genres
		// YTS uses genre names as strings (e.g., "Action", "Comedy", "Drama")
		// Fetch multiple pages to get a better genre sample
		const allMovies = []
		for (let page = 1; page <= 3; page++) {
			const movies = await listMovies({
				limit: 20,
				page,
			})
			allMovies.push(...movies)
			if (movies.length === 0) break
		}
		const movies = allMovies

		// Extract unique genres from movies
		const genreSet = new Set<string>()
		movies.forEach((movie) => {
			if (movie.genres && Array.isArray(movie.genres)) {
				movie.genres.forEach((genre: string) => {
					if (genre && typeof genre === 'string') {
						genreSet.add(genre)
					}
				})
			}
		})

		// Convert to array and sort alphabetically
		const genres = Array.from(genreSet)
			.sort()
			.map((name) => ({
				id: name, // Use genre name as ID since YTS uses names
				name,
			}))

		// Cache the results
		genresCache = genres
		genresCacheTime = now

		return NextResponse.json(genres, { status: 200 })
	} catch (error) {
		console.error('Error fetching genres:', error)
		// Return cached genres if available, even if expired
		if (genresCache) {
			return NextResponse.json(genresCache, { status: 200 })
		}
		return NextResponse.json(
			{ error: 'Failed to fetch genres' },
			{ status: 500 }
		)
	}
}



