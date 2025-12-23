'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MovieGrid } from '@/components/movie/movie-grid'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'
import { cn } from '@/utils/cn'

interface Genre {
	id: string
	name: string
}

export default function CategoriesPage() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const genreParam = searchParams.get('genre')
	const [genres, setGenres] = useState<Genre[]>([])
	const [movies, setMovies] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingGenres, setIsLoadingGenres] = useState(true)
	const [selectedGenre, setSelectedGenre] = useState<string | null>(
		genreParam ? decodeURIComponent(genreParam) : null
	)

	useEffect(() => {
		const loadGenres = async () => {
			setIsLoadingGenres(true)
			try {
				const response = await fetch('/api/movies/genres')
				if (response.ok) {
					const data = await response.json()
					setGenres(data || [])
				}
			} catch (error) {
				console.error('Error loading genres:', error)
			} finally {
				setIsLoadingGenres(false)
			}
		}
		loadGenres()
	}, [])

	useEffect(() => {
		if (selectedGenre) {
			setIsLoading(true)
			const loadMovies = async () => {
				try {
					const encodedGenre = encodeURIComponent(selectedGenre)
					const response = await fetch(
						`/api/movies/genres/${encodedGenre}?page=1`
					)
					if (response.ok) {
						const data = await response.json()
						setMovies(data.results || [])
					} else {
						setMovies([])
					}
				} catch (error) {
					console.error('Error loading movies:', error)
					setMovies([])
				} finally {
					setIsLoading(false)
				}
			}
			loadMovies()
		} else {
			setMovies([])
		}
	}, [selectedGenre])

	const handleGenreClick = (genreName: string) => {
		setSelectedGenre(genreName)
		const encodedGenre = encodeURIComponent(genreName)
		router.push(`/categories?genre=${encodedGenre}`)
	}

	const handleBack = () => {
		setSelectedGenre(null)
		router.push('/categories')
	}

	if (selectedGenre) {
		const genre = genres.find((g) => g.name === selectedGenre)
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<Button
						variant="ghost"
						onClick={handleBack}
						className="mb-4"
					>
						<Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
						Back to Categories
					</Button>
					<h1 className="text-3xl font-bold">
						{genre?.name || selectedGenre} Movies
					</h1>
					<p className="mt-2 text-muted-foreground">
						Discover movies in the {genre?.name || selectedGenre} genre
					</p>
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
					Explore movies by genre
				</p>
			</div>
			
			{isLoadingGenres ? (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
					{Array.from({ length: 10 }).map((_, i) => (
						<div
							key={i}
							className="h-24 animate-pulse rounded-lg border bg-card"
						/>
					))}
				</div>
			) : genres.length === 0 ? (
				<div className="text-center py-12">
					<Icon name="Film" className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
					<p className="text-muted-foreground">No genres available</p>
				</div>
			) : (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
					{genres.map((genre) => (
						<button
							key={genre.id}
							onClick={() => handleGenreClick(genre.name)}
							className={cn(
								'rounded-lg border bg-card p-6 text-center transition-all',
								'hover:bg-accent hover:border-primary hover:scale-105',
								'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
							)}
						>
							<h3 className="font-semibold text-lg">{genre.name}</h3>
						</button>
					))}
				</div>
			)}
		</div>
	)
}

