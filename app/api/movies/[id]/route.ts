import { NextRequest, NextResponse } from 'next/server'
import { getMovieDetails as getYtsMovieDetails } from '@/lib/api/yts'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const movieId = parseInt(id, 10)

		if (isNaN(movieId)) {
			return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 })
		}

		const details = await getYtsMovieDetails(movieId)

		return NextResponse.json(details, { status: 200 })
	} catch (error) {
		console.error('Error fetching movie details:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch movie details' },
			{ status: 500 }
		)
	}
}


