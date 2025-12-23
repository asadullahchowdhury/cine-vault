import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
	process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export async function GET(request: NextRequest) {
	try {
		const token = request.cookies.get('auth-token')?.value

		if (!token) {
			return NextResponse.json({ user: null }, { status: 200 })
		}

		const { payload } = await jwtVerify(token, secret)

		return NextResponse.json(
			{
				user: {
					id: payload.userId,
					email: payload.email,
					name: payload.name,
				},
			},
			{ status: 200 }
		)
	} catch (error) {
		return NextResponse.json({ user: null }, { status: 200 })
	}
}



