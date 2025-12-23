'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@/components/icons'
import { RatingBadge } from './rating-badge'
import { cn } from '@/utils/cn'

interface MovieCardProps {
	id: number
	title: string
	posterPath: string | null
	rating: number
	releaseDate?: string
	type?: 'movie'
	className?: string
}

const PLACEHOLDER_IMAGE =
	'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgZmlsbD0iIzFmMWYxZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='

export function MovieCard({
	id,
	title,
	posterPath,
	rating,
	releaseDate,
	type = 'movie',
	className,
}: MovieCardProps) {
	const href = `/preview/${id}`
	// YTS provides full URLs, use placeholder if null
	const imageUrl = posterPath || PLACEHOLDER_IMAGE

	return (
		<div
			className={cn('group relative transition-transform duration-200 hover:-translate-y-2 hover:scale-105', className)}
		>
			<Link href={href} className="block">
				<div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-800">
					<Image
						src={imageUrl}
						alt={title}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-110"
						sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
						unoptimized={imageUrl?.includes('yts.')}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
					<div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
						<h3 className="mb-2 line-clamp-2 text-sm font-semibold text-white">
							{title}
						</h3>
						{releaseDate && (
							<p className="text-xs text-gray-300">
								{new Date(releaseDate).getFullYear()}
							</p>
						)}
					</div>
					<div className="absolute top-2 right-2">
						<RatingBadge rating={rating} />
					</div>
					<div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
						<div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
							<Icon name="Play" className="h-6 w-6 fill-white text-white" />
						</div>
					</div>
				</div>
			</Link>
		</div>
	)
}

