'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MovieGrid } from '@/components/movie/movie-grid'
import { Button } from '@/components/ui/button'

export default function CategoriesPage() {
	const searchParams = useSearchParams()
	const genreId = searchParams.get('genre')
	const type = searchParams.get('type') || 'movie'
	const [genres, setGenres] = useState<any[]>([])
	const [movies, setMovies] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [selectedGenre, setSelectedGenre] = useState<number | null>(
		genreId ? parseInt(genreId, 10) : null
	)

	useEffect(() => {
		const loadGenres = async () => {
			try {
				const [movieResponse, tvResponse] = await Promise.all([
					fetch('/api/movies/genres?type=movie'),
					fetch('/api/movies/genres?type=tv'),
				])
				const movieGenres = await movieResponse.json()
				const tvGenres = await tvResponse.json()
				setGenres([...movieGenres, ...tvGenres])
			} catch (error) {
				console.error('Error loading genres:', error)
			}
		}
		loadGenres()
	}, [])

	useEffect(() => {
		if (selectedGenre) {
			setIsLoading(true)
			const loadMovies = async () => {
				try {
					const response = await fetch(
						`/api/movies/genres/${selectedGenre}?type=${type}`
					)
					const data = await response.json()
					setMovies(data.results || [])
				} catch (error) {
					console.error('Error loading movies:', error)
				} finally {
					setIsLoading(false)
				}
			}
			loadMovies()
		} else {
			setMovies([])
		}
	}, [selectedGenre, type])

	if (selectedGenre) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<Button
						variant="ghost"
						onClick={() => {
							setSelectedGenre(null)
							window.history.pushState({}, '', '/categories')
						}}
					>
						← Back to Categories
					</Button>
					<h1 className="mt-4 text-3xl font-bold">
						{genres.find((g) => g.id === selectedGenre)?.name || 'Movies'}
					</h1>
				</div>
				<MovieGrid movies={movies} isLoading={isLoading} />
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Browse by Category</h1>
				<p className="mt-2 text-muted-foreground">
					Explore movies and TV shows by genre
				</p>
			</div>
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{genres.map((genre) => (
					<Link
						key={genre.id}
						href={`/categories?genre=${genre.id}&type=movie`}
						className="rounded-lg border bg-card p-6 text-center transition-colors hover:bg-accent"
						onClick={(e) => {
							e.preventDefault()
							setSelectedGenre(genre.id)
							window.history.pushState(
								{},
								'',
								`/categories?genre=${genre.id}&type=movie`
							)
						}}
					>
						<h3 className="font-semibold">{genre.name}</h3>
					</Link>
				))}
			</div>
		</div>
	)
}

