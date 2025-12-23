import { NextRequest, NextResponse } from 'next/server'
import { createConnectionPool, queryOne } from '@/lib/db/connection'
import { hashPassword } from '@/lib/auth/password'
import { z } from 'zod'

const registerSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(6),
})

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const validatedData = registerSchema.parse(body)

		const pool = createConnectionPool()
		const existingUser = await queryOne<{ id: number }>(
			'SELECT id FROM users WHERE email = ?',
			[validatedData.email]
		)

		if (existingUser) {
			return NextResponse.json(
				{ error: 'Email already registered' },
				{ status: 400 }
			)
		}

		const passwordHash = await hashPassword(validatedData.password)

		await pool.execute(
			'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
			[validatedData.name, validatedData.email, passwordHash]
		)

		return NextResponse.json(
			{ message: 'User registered successfully' },
			{ status: 201 }
		)
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: 'Invalid input data', details: error.errors },
				{ status: 400 }
			)
		}

		console.error('Registration error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}


