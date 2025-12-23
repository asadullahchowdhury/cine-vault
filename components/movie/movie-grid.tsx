'use client'

import { MovieCard } from './movie-card'
import { Skeleton } from '@/components/ui/skeleton'

interface Movie {
	id: number
	title?: string
	name?: string
	poster_path: string | null
	vote_average: number
	release_date?: string
	first_air_date?: string
	media_type?: 'movie' | 'tv'
}

interface MovieGridProps {
	movies: Movie[]
	isLoading?: boolean
	className?: string
}

export function MovieGrid({ movies, isLoading, className }: MovieGridProps) {
	if (isLoading) {
		return (
			<div
				className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ${className || ''}`}
			>
				{Array.from({ length: 12 }).map((_, i) => (
					<Skeleton key={i} className="aspect-[2/3] w-full" />
				))}
			</div>
		)
	}

	if (movies.length === 0) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<p className="text-muted-foreground">No movies found</p>
			</div>
		)
	}

	return (
		<div
			className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ${className || ''}`}
		>
			{movies.map((movie) => (
				<MovieCard
					key={movie.id}
					id={movie.id}
					title={movie.title || movie.name || 'Untitled'}
					posterPath={movie.poster_path}
					rating={movie.vote_average}
					releaseDate={movie.release_date || movie.first_air_date}
					type={movie.media_type || 'movie'}
				/>
			))}
		</div>
	)
}

