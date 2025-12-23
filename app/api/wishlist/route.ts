import { NextRequest, NextResponse } from 'next/server'
import { createConnectionPool, query, queryOne } from '@/lib/db/connection'
import { jwtVerify } from 'jose'
import { z } from 'zod'

const secret = new TextEncoder().encode(
	process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

async function getUserId(request: NextRequest): Promise<number | null> {
	try {
		const token = request.cookies.get('auth-token')?.value
		if (!token) return null

		const { payload } = await jwtVerify(token, secret)
		return payload.userId as number
	} catch {
		return null
	}
}

const addWishlistSchema = z.object({
	movieId: z.number(),
	movieType: z.enum(['movie', 'tv']),
	title: z.string().optional(),
	posterPath: z.string().nullable().optional(),
	rating: z.number().optional(),
	releaseDate: z.string().optional(),
})

export async function GET(request: NextRequest) {
	const userId = await getUserId(request)

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const pool = createConnectionPool()
		const wishlist = await query<{
			id: number
			movie_id: number
			movie_type: string
			created_at: Date
		}>('SELECT * FROM wishlist WHERE user_id = ? ORDER BY created_at DESC', [
			userId,
		])

		return NextResponse.json(wishlist, { status: 200 })
	} catch (error) {
		console.error('Error fetching wishlist:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

export async function POST(request: NextRequest) {
	const userId = await getUserId(request)

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const body = await request.json()
		const validatedData = addWishlistSchema.parse(body)

		const pool = createConnectionPool()

		// Check if already in wishlist
		const existing = await queryOne<{ id: number }>(
			'SELECT id FROM wishlist WHERE user_id = ? AND movie_id = ? AND movie_type = ?',
			[userId, validatedData.movieId, validatedData.movieType]
		)

		if (existing) {
			return NextResponse.json(
				{ error: 'Already in wishlist' },
				{ status: 400 }
			)
		}

		await pool.execute(
			'INSERT INTO wishlist (user_id, movie_id, movie_type) VALUES (?, ?, ?)',
			[userId, validatedData.movieId, validatedData.movieType]
		)

		return NextResponse.json(
			{ message: 'Added to wishlist' },
			{ status: 201 }
		)
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: 'Invalid input data', details: error.errors },
				{ status: 400 }
			)
		}

		console.error('Error adding to wishlist:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}



