'use client'

import { useEffect, useState } from 'react'

export function Preloader() {
	const [isLoading, setIsLoading] = useState(true)
	const [progress, setProgress] = useState(0)

	useEffect(() => {
		// Animate progress from 0 to 100
		const progressInterval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(progressInterval)
					return 100
				}
				return prev + 2
			})
		}, 40)

		const timer = setTimeout(() => {
			setProgress(100)
			setTimeout(() => {
				setIsLoading(false)
			}, 300)
		}, 2000)

		return () => {
			clearTimeout(timer)
			clearInterval(progressInterval)
		}
	}, [])

	if (!isLoading) return null

	return (
		<div
			className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
			style={{
				animation: 'fade-out 0.3s ease-out forwards',
				animationDelay: '1.7s',
			}}
		>
			{/* Animated background gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5 animate-pulse" />

			{/* Floating particles */}
			<div className="absolute inset-0 overflow-hidden">
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className="absolute rounded-full bg-primary/20 animate-float"
						style={{
							width: `${20 + i * 10}px`,
							height: `${20 + i * 10}px`,
							left: `${20 + i * 15}%`,
							top: `${30 + i * 10}%`,
							animationDuration: `${3 + i * 0.5}s`,
							animationDelay: `${i * 0.2}s`,
						}}
					/>
				))}
			</div>

			<div className="relative flex flex-col items-center gap-6 z-10">
				{/* Main logo container with multiple animated rings */}
				<div className="relative h-20 w-20">
					{/* Outer pulsing ring */}
					<div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
					
					{/* Middle rotating ring */}
					<div className="h-20 w-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
					
					{/* Inner pulsing dot */}
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary animate-pulse" />
				</div>

				{/* Logo text with fade and scale animation */}
				<h1 className="text-3xl font-bold text-primary animate-fade-in-scale animate-pulse">
					CineVault
				</h1>

				{/* Progress bar */}
				<div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
					<div
						className="h-full bg-primary transition-all duration-300 ease-out"
						style={{ width: `${progress}%` }}
					/>
				</div>

				{/* Loading text */}
				<p
					className="text-sm text-muted-foreground animate-fade-in"
					style={{
						animationDelay: '0.5s',
					}}
				>
					Loading your cinematic experience...
				</p>
			</div>
		</div>
	)
}

