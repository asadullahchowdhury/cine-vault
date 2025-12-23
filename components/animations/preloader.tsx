'use client'

import { useEffect, useState } from 'react'

export function Preloader() {
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false)
		}, 2000)

		return () => clearTimeout(timer)
	}, [])

	if (!isLoading) return null

	return (
		<div className="fixed inset-0 z-9999 flex items-center justify-center bg-background animate-fade-out">
			<div className="flex flex-col items-center gap-4">
				<div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin-slow" />
				<h1 className="text-2xl font-bold text-primary animate-fade-in">
					CineVault
				</h1>
			</div>
		</div>
	)
}

