import { NextRequest, NextResponse } from 'next/server'
import { createConnectionPool, queryOne } from '@/lib/db/connection'
import { verifyPassword } from '@/lib/auth/password'
import { z } from 'zod'
import { SignJWT } from 'jose'

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

const secret = new TextEncoder().encode(
	process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const validatedData = loginSchema.parse(body)

		const pool = createConnectionPool()
		const user = await queryOne<{
			id: number
			email: string
			name: string
			password_hash: string
		}>('SELECT id, email, name, password_hash FROM users WHERE email = ?', [
			validatedData.email,
		])

		if (!user) {
			return NextResponse.json(
				{ error: 'Invalid email or password' },
				{ status: 401 }
			)
		}

		const isValidPassword = await verifyPassword(
			validatedData.password,
			user.password_hash
		)

		if (!isValidPassword) {
			return NextResponse.json(
				{ error: 'Invalid email or password' },
				{ status: 401 }
			)
		}

		const token = await new SignJWT({
			userId: user.id,
			email: user.email,
			name: user.name,
		})
			.setProtectedHeader({ alg: 'HS256' })
			.setExpirationTime('7d')
			.sign(secret)

		const response = NextResponse.json(
			{ message: 'Login successful', user: { id: user.id, email: user.email, name: user.name } },
			{ status: 200 }
		)

		response.cookies.set('auth-token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7, // 7 days
		})

		return response
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: 'Invalid input data', details: error.errors },
				{ status: 400 }
			)
		}

		console.error('Login error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}



