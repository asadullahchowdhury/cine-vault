'use client'

import { useState, useEffect } from 'react'
import { Icon } from '@/components/icons'
import { MovieGrid } from '@/components/movie/movie-grid'
import { Button } from '@/components/ui/button'

export default function WishlistPage() {
	const [wishlist, setWishlist] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const loadWishlist = async () => {
			try {
				const response = await fetch('/api/wishlist')
				if (response.ok) {
					const items = await response.json()
					// Fetch movie details for each wishlist item
					const movies = await Promise.all(
						items.map(async (item: any) => {
							try {
								const movieResponse = await fetch(
									`/api/movies/${item.movie_id}?type=${item.movie_type}`
								)
								if (movieResponse.ok) {
									const movieData = await movieResponse.json()
									return {
										id: movieData.id,
										title: movieData.title || movieData.name,
										poster_path: movieData.poster_path,
										vote_average: movieData.vote_average || 0,
										release_date:
											movieData.release_date || movieData.first_air_date,
										media_type: item.movie_type,
									}
								}
							} catch (err) {
								console.error('Error fetching movie:', err)
								return null
							}
							return null
						})
					)
					setWishlist(movies.filter(Boolean))
				}
			} catch (error) {
				console.error('Error loading wishlist:', error)
			} finally {
				setIsLoading(false)
			}
		}
		loadWishlist()
	}, [])

	const handleRemove = async (movieId: number, movieType: string) => {
		try {
			const response = await fetch(`/api/wishlist/${movieId}?type=${movieType}`, {
				method: 'DELETE',
			})
			if (response.ok) {
				setWishlist((prev) =>
					prev.filter(
						(item) =>
							!(item.movie_id === movieId && item.movie_type === movieType)
					)
				)
			}
		} catch (error) {
			console.error('Error removing from wishlist:', error)
		}
	}

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<MovieGrid movies={[]} isLoading={true} />
			</div>
		)
	}

	if (wishlist.length === 0) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex min-h-[400px] flex-col items-center justify-center">
					<Icon name="Heart" className="mb-4 h-16 w-16 text-muted-foreground" />
					<h2 className="mb-2 text-2xl font-semibold">Your Wishlist is Empty</h2>
					<p className="mb-6 text-muted-foreground">
						Start adding movies to your wishlist
					</p>
					<a href="/home">
						<Button>Browse Movies</Button>
					</a>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">My Wishlist</h1>
				<p className="mt-2 text-muted-foreground">
					{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
				</p>
			</div>
			<MovieGrid movies={wishlist} />
		</div>
	)
}

