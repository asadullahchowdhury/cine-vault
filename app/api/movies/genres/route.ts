import { NextRequest, NextResponse } from 'next/server'
import { getGenres } from '@/lib/api/tmdb'

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const type = (searchParams.get('type') as 'movie' | 'tv') || 'movie'

		const genres = await getGenres(type)
		return NextResponse.json(genres, { status: 200 })
	} catch (error) {
		console.error('Error fetching genres:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch genres' },
			{ status: 500 }
		)
	}
}



