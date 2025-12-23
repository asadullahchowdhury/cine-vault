import { NextRequest, NextResponse } from 'next/server'
import { createConnectionPool } from '@/lib/db/connection'
import { jwtVerify } from 'jose'

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

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const userId = await getUserId(request)

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const { id } = await params
		const movieId = parseInt(id, 10)
		const searchParams = request.nextUrl.searchParams
		const movieType = searchParams.get('type') || 'movie'

		if (isNaN(movieId)) {
			return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 })
		}

		const pool = createConnectionPool()
		const [result] = await pool.execute(
			'DELETE FROM wishlist WHERE user_id = ? AND movie_id = ? AND movie_type = ?',
			[userId, movieId, movieType]
		)

		const deleted = (result as any).affectedRows > 0

		if (!deleted) {
			return NextResponse.json(
				{ error: 'Item not found in wishlist' },
				{ status: 404 }
			)
		}

		return NextResponse.json(
			{ message: 'Removed from wishlist' },
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error removing from wishlist:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}


