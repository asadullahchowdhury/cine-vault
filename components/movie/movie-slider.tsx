'use client'

import { useRef } from 'react'
import { Icon } from '@/components/icons'
import { MovieCard } from './movie-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

interface Movie {
	id: number
	title?: string
	name?: string
	poster_path: string | null
	vote_average: number
	release_date?: string | null
	first_air_date?: string | null
	media_type?: 'movie'
}

interface MovieSliderProps {
	title: string
	movies: Movie[]
	className?: string
}

export function MovieSlider({ title, movies, className }: MovieSliderProps) {
	const scrollRef = useRef<HTMLDivElement>(null)

	const scroll = (direction: 'left' | 'right') => {
		if (!scrollRef.current) return

		const scrollAmount = 300
		const currentScroll = scrollRef.current.scrollLeft
		const newScroll =
			direction === 'left'
				? currentScroll - scrollAmount
				: currentScroll + scrollAmount

		scrollRef.current.scrollTo({
			left: newScroll,
			behavior: 'smooth',
		})
	}

	return (
		<div className={cn('space-y-4', className)}>
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold md:text-2xl">{title}</h2>
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="icon"
						onClick={() => scroll('left')}
						className="h-8 w-8"
					>
						<Icon name="ChevronLeft" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={() => scroll('right')}
						className="h-8 w-8"
					>
						<Icon name="ChevronRight" />
					</Button>
				</div>
			</div>
			<div
				ref={scrollRef}
				className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
				style={{
					scrollbarWidth: 'none',
					msOverflowStyle: 'none',
				}}
			>
				{movies.map((movie) => (
					<div key={movie.id} className="min-w-[150px] flex-shrink-0">
						<MovieCard
							id={movie.id}
							title={movie.title || movie.name || 'Untitled'}
							posterPath={movie.poster_path}
							rating={movie.vote_average}
							releaseDate={movie.release_date || movie.first_air_date}
							type={movie.media_type || 'movie'}
						/>
					</div>
				))}
			</div>
		</div>
	)
}

