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

const registerSchema = z
	.object({
		name: z.string().min(2, 'Name must be at least 2 characters'),
		email: z.string().email('Invalid email address'),
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	})

	const onSubmit = async (data: RegisterFormData) => {
		setIsLoading(true)
		setError('')

		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: data.name,
					email: data.email,
					password: data.password,
				}),
			})

			const result = await response.json()

			if (response.ok) {
				router.push('/home')
				router.refresh()
			} else {
				setError(result.error || 'Registration failed')
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
					<CardTitle className="text-2xl">Create Account</CardTitle>
					<CardDescription>
						Sign up to start saving your favorite movies
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
							<label htmlFor="name" className="mb-2 block text-sm font-medium">
								Name
							</label>
							<Input
								id="name"
								type="text"
								placeholder="John Doe"
								{...register('name')}
							/>
							{errors.name && (
								<p className="mt-1 text-sm text-destructive">
									{errors.name.message}
								</p>
							)}
						</div>
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
						<div>
							<label
								htmlFor="confirmPassword"
								className="mb-2 block text-sm font-medium"
							>
								Confirm Password
							</label>
							<Input
								id="confirmPassword"
								type="password"
								placeholder="••••••••"
								{...register('confirmPassword')}
							/>
							{errors.confirmPassword && (
								<p className="mt-1 text-sm text-destructive">
									{errors.confirmPassword.message}
								</p>
							)}
						</div>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? 'Creating account...' : 'Sign Up'}
						</Button>
						<div className="text-center text-sm">
							Already have an account?{' '}
							<Link href="/login" className="text-primary hover:underline">
								Login
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}



