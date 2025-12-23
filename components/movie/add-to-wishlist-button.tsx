'use client'

import { useState } from 'react'
import { Icon } from '@/components/icons'
import { Button } from '@/components/ui/button'

interface AddToWishlistButtonProps {
	movieId: number
	movieType: 'movie' | 'tv'
	title?: string
}

export function AddToWishlistButton({
	movieId,
	movieType,
	title,
}: AddToWishlistButtonProps) {
	const [isInWishlist, setIsInWishlist] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const handleToggle = async () => {
		setIsLoading(true)
		try {
			if (isInWishlist) {
				const response = await fetch(
					`/api/wishlist/${movieId}?type=${movieType}`,
					{
						method: 'DELETE',
					}
				)
				if (response.ok) {
					setIsInWishlist(false)
				}
			} else {
				const response = await fetch('/api/wishlist', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						movieId,
						movieType,
						title,
					}),
				})
				if (response.ok) {
					setIsInWishlist(true)
				}
			}
		} catch (error) {
			console.error('Error updating wishlist:', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button
			size="lg"
			variant="default"
			onClick={handleToggle}
			disabled={isLoading}
		>
			<Icon
				name="Heart"
				className={`mr-2 h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`}
			/>
			{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
		</Button>
	)
}



