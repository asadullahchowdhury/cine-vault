import { NextResponse } from 'next/server'
import { getTrendingMovies } from '@/lib/api/yts'
import { ytsToUnified } from '@/types/movie'

export async function GET() {
	try {
		const movies = await getTrendingMovies(20)
		return NextResponse.json(movies.map(ytsToUnified), { status: 200 })
	} catch (error) {
		console.error('Error fetching trending movies:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch trending movies' },
			{ status: 500 }
		)
	}
}


