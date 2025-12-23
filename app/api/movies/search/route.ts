import { NextRequest, NextResponse } from 'next/server'
import { searchMovies as searchYtsMovies } from '@/lib/api/yts'
import { ytsToUnified } from '@/types/movie'

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const query = searchParams.get('q')
		const page = parseInt(searchParams.get('page') || '1', 10)

		if (!query || query.trim() === '') {
			return NextResponse.json(
				{ error: 'Query parameter is required' },
				{ status: 400 }
			)
		}

		// Search movies using YTS
		const results = await searchYtsMovies(query.trim(), page)
		
		// Ensure we have valid results
		if (!results || !Array.isArray(results.movies)) {
			return NextResponse.json({
				results: [],
				total_pages: 0,
				total_results: 0,
			})
		}

		return NextResponse.json({
			results: results.movies.map(ytsToUnified),
			total_pages: results.movie_count > 0 
				? Math.ceil(results.movie_count / results.limit) 
				: 0,
			total_results: results.movie_count || 0,
		})
	} catch (error) {
		console.error('Error searching:', error)
		return NextResponse.json(
			{ 
				error: 'Failed to search',
				results: [],
				total_pages: 0,
				total_results: 0,
			},
			{ status: 500 }
		)
	}
}


