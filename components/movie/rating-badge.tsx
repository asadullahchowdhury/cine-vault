import { Icon } from '@/components/icons'
import { cn } from '@/utils/cn'

interface RatingBadgeProps {
	rating: number
	className?: string
}

export function RatingBadge({ rating, className }: RatingBadgeProps) {
	const normalizedRating = Math.min(Math.max(rating / 2, 0), 5)

	return (
		<div
			className={cn(
				'flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 backdrop-blur-sm',
				className
			)}
		>
			<Icon name="Star" className="h-3 w-3 fill-yellow-400 text-yellow-400" />
			<span className="text-xs font-semibold text-white">
				{rating.toFixed(1)}
			</span>
		</div>
	)
}

