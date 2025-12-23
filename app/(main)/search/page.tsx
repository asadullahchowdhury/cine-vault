'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Icon } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MovieGrid } from '@/components/movie/movie-grid'

export default function SearchPage() {
	const searchParams = useSearchParams()
	const [query, setQuery] = useState(searchParams.get('q') || '')
	const [movies, setMovies] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)

	const performSearch = useCallback(async (searchQuery: string, pageNum = 1) => {
		if (!searchQuery.trim()) {
			setMovies([])
			return
		}

		setIsLoading(true)
		try {
			const response = await fetch(
				`/api/movies/search?q=${encodeURIComponent(searchQuery)}&page=${pageNum}`
			)
			const data = await response.json()
			if (pageNum === 1) {
				setMovies(data.results || [])
			} else {
				setMovies((prev) => [...prev, ...(data.results || [])])
			}
			setTotalPages(data.total_pages || 1)
		} catch (error) {
			console.error('Search error:', error)
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		const initialQuery = searchParams.get('q')
		if (initialQuery) {
			setQuery(initialQuery)
			performSearch(initialQuery)
		}
	}, [searchParams, performSearch])

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		setPage(1)
		performSearch(query, 1)
		window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`)
	}

	const loadMore = () => {
		if (page < totalPages && !isLoading) {
			const nextPage = page + 1
			setPage(nextPage)
			performSearch(query, nextPage)
		}
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<form onSubmit={handleSearch} className="flex gap-4">
					<div className="relative flex-1">
						<Icon name="Search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search for movies, TV shows..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Button type="submit" disabled={isLoading}>
						Search
					</Button>
				</form>
			</div>

			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold">
					{query ? `Search Results for "${query}"` : 'Search Movies & TV Shows'}
				</h1>
				<Button variant="outline" size="sm">
					<Icon name="Filter" className="mr-2 h-4 w-4" />
					Filters
				</Button>
			</div>

			<MovieGrid movies={movies} isLoading={isLoading} />

			{page < totalPages && movies.length > 0 && (
				<div className="mt-8 text-center">
					<Button onClick={loadMore} disabled={isLoading}>
						Load More
					</Button>
				</div>
			)}
		</div>
	)
}

