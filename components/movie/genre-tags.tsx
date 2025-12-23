import Link from 'next/link'
import { cn } from '@/utils/cn'

interface Genre {
	id: number
	name: string
}

interface GenreTagsProps {
	genres: Genre[]
	className?: string
}

export function GenreTags({ genres, className }: GenreTagsProps) {
	return (
		<div className={cn('flex flex-wrap gap-2', className)}>
			{genres.map((genre) => (
				<Link
					key={genre.id}
					href={`/categories?genre=${genre.id}`}
					className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
				>
					{genre.name}
				</Link>
			))}
		</div>
	)
}



