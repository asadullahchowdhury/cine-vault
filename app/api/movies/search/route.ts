import { NextRequest, NextResponse } from 'next/server'
import { searchMovies as searchYtsMovies } from '@/lib/api/yts'
import { searchTvShows } from '@/lib/api/tmdb'
import { ytsToUnified, tmdbTvToUnified } from '@/types/movie'

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const query = searchParams.get('q')
		const page = parseInt(searchParams.get('page') || '1', 10)
		const type = searchParams.get('type') // 'movie', 'tv', or null for both

		if (!query) {
			return NextResponse.json(
				{ error: 'Query parameter is required' },
				{ status: 400 }
			)
		}

		if (type === 'tv') {
			// TV shows only - use TMDB
			const results = await searchTvShows(query, page)
			return NextResponse.json({
				results: results.results.map(tmdbTvToUnified),
				total_pages: results.total_pages,
				total_results: results.total_results,
			})
		} else if (type === 'movie') {
			// Movies only - use YTS
			const results = await searchYtsMovies(query, page)
			return NextResponse.json({
				results: results.movies.map(ytsToUnified),
				total_pages: Math.ceil(results.movie_count / results.limit),
				total_results: results.movie_count,
			})
		} else {
			// Both - search movies with YTS and TV with TMDB
			const [movieResults, tvResults] = await Promise.all([
				searchYtsMovies(query, page).catch(() => ({
					movies: [],
					movie_count: 0,
					limit: 20,
					page_number: 1,
				})),
				searchTvShows(query, page).catch(() => ({
					results: [],
					total_pages: 0,
					total_results: 0,
				})),
			])

			const combinedResults = [
				...movieResults.movies.map(ytsToUnified),
				...tvResults.results.map(tmdbTvToUnified),
			]

			return NextResponse.json({
				results: combinedResults,
				total_pages: Math.max(
					Math.ceil(movieResults.movie_count / movieResults.limit),
					tvResults.total_pages
				),
				total_results: movieResults.movie_count + tvResults.total_results,
			})
		}
	} catch (error) {
		console.error('Error searching:', error)
		return NextResponse.json(
			{ error: 'Failed to search' },
			{ status: 500 }
		)
	}
}


