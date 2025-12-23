import { NextRequest, NextResponse } from 'next/server'
import { getMoviesByGenre as getYtsMoviesByGenre } from '@/lib/api/yts'
import { ytsToUnified } from '@/types/movie'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const searchParams = request.nextUrl.searchParams
		const page = parseInt(searchParams.get('page') || '1', 10)

		// Movies - use genre name (YTS uses string genre names)
		const genreName = decodeURIComponent(id)
		
		if (!genreName || genreName.trim() === '') {
			return NextResponse.json(
				{ error: 'Invalid genre name' },
				{ status: 400 }
			)
		}

		const data = await getYtsMoviesByGenre(genreName.trim(), page)
		
		if (!data || !Array.isArray(data.movies)) {
			return NextResponse.json({
				results: [],
				total_pages: 0,
			})
		}

		return NextResponse.json({
			results: data.movies.map(ytsToUnified),
			total_pages: data.movie_count > 0 
				? Math.ceil(data.movie_count / data.limit) 
				: 0,
		})
	} catch (error) {
		console.error('Error fetching movies by genre:', error)
		return NextResponse.json(
			{ 
				error: 'Failed to fetch movies',
				results: [],
				total_pages: 0,
			},
			{ status: 500 }
		)
	}
}


