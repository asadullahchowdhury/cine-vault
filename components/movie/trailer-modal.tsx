'use client'

import { useState } from 'react'
import { Icon } from '@/components/icons'
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface TrailerModalProps {
	trailerKey: string
}

export function TrailerModal({ trailerKey }: TrailerModalProps) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size="lg" variant="default" className="bg-primary hover:bg-primary/90">
					<Icon name="Play" className="mr-2 h-4 w-4 fill-white" />
					Watch Trailer
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-4xl p-0">
				<div className="relative aspect-video w-full">
					<iframe
						src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
						title="Trailer"
						className="h-full w-full"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					/>
				</div>
			</DialogContent>
		</Dialog>
	)
}

