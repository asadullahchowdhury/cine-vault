import { NextRequest, NextResponse } from 'next/server'
import { getMoviesByGenre as getYtsMoviesByGenre } from '@/lib/api/yts'
import { getTvByGenre } from '@/lib/api/tmdb'
import { ytsToUnified, tmdbTvToUnified } from '@/types/movie'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const searchParams = request.nextUrl.searchParams
		const type = searchParams.get('type') || 'movie'
		const page = parseInt(searchParams.get('page') || '1', 10)

		if (type === 'tv') {
			// TV shows - use numeric genre ID
			const genreId = parseInt(id, 10)
			if (isNaN(genreId)) {
				return NextResponse.json({ error: 'Invalid genre ID' }, { status: 400 })
			}
			const data = await getTvByGenre(genreId, page)
			return NextResponse.json({
				results: data.results.map(tmdbTvToUnified),
				total_pages: data.total_pages,
			})
		} else {
			// Movies - use genre name (YTS uses string genre names)
			const genreName = decodeURIComponent(id)
			const data = await getYtsMoviesByGenre(genreName, page)
			return NextResponse.json({
				results: data.movies.map(ytsToUnified),
				total_pages: Math.ceil(data.movie_count / data.limit),
			})
		}
	} catch (error) {
		console.error('Error fetching movies by genre:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch movies' },
			{ status: 500 }
		)
	}
}


