'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	})

	const onSubmit = async (data: LoginFormData) => {
		setIsLoading(true)
		setError('')

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})

			const result = await response.json()

			if (response.ok) {
				router.push('/home')
				router.refresh()
			} else {
				setError(result.error || 'Login failed')
			}
		} catch (err) {
			setError('An error occurred. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl">Login to CineVault</CardTitle>
					<CardDescription>
						Enter your credentials to access your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						{error && (
							<div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
								{error}
							</div>
						)}
						<div>
							<label htmlFor="email" className="mb-2 block text-sm font-medium">
								Email
							</label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								{...register('email')}
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-destructive">
									{errors.email.message}
								</p>
							)}
						</div>
						<div>
							<label
								htmlFor="password"
								className="mb-2 block text-sm font-medium"
							>
								Password
							</label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								{...register('password')}
							/>
							{errors.password && (
								<p className="mt-1 text-sm text-destructive">
									{errors.password.message}
								</p>
							)}
						</div>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? 'Logging in...' : 'Login'}
						</Button>
						<div className="text-center text-sm">
							Don't have an account?{' '}
							<Link href="/register" className="text-primary hover:underline">
								Sign up
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}


