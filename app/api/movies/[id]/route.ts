import { NextRequest, NextResponse } from 'next/server'
import { getMovieDetails as getYtsMovieDetails } from '@/lib/api/yts'
import { getTvDetails } from '@/lib/api/tmdb'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const movieId = parseInt(id, 10)
		const searchParams = request.nextUrl.searchParams
		const type = searchParams.get('type') || 'movie'

		if (isNaN(movieId)) {
			return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 })
		}

		const details =
			type === 'tv'
				? await getTvDetails(movieId)
				: await getYtsMovieDetails(movieId)

		return NextResponse.json(details, { status: 200 })
	} catch (error) {
		console.error('Error fetching movie details:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch movie details' },
			{ status: 500 }
		)
	}
}


