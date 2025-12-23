import {
	getTrendingMovies,
	getTopRatedMovies,
	getLatestMovies,
} from '@/lib/api/yts'
import { ytsToUnified } from '@/types/movie'
import { MovieSlider } from '@/components/movie/movie-slider'

export default async function HomePage() {
	try {
		const [trending, topRated, latest] = await Promise.all([
			getTrendingMovies(20),
			getTopRatedMovies(20),
			getLatestMovies(20),
		])

		console.log('HomePage Data:', {
			trending: trending.length,
			topRated: topRated.length,
			latest: latest.length,
		})

		return (
			<div className="container mx-auto space-y-12 px-4 py-8">
				<MovieSlider
					title="Trending Now"
					movies={trending.map(ytsToUnified).slice(0, 20)}
				/>
				<MovieSlider
					title="Top Rated"
					movies={topRated.map(ytsToUnified).slice(0, 20)}
				/>
				<MovieSlider
					title="Latest Movies"
					movies={latest.map(ytsToUnified).slice(0, 20)}
				/>
			</div>
		)
	} catch (error) {
		console.error('HomePage Error:', error)
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<h2 className="text-2xl font-bold mb-4">Error Loading Movies</h2>
					<p className="text-muted-foreground">
						{error instanceof Error ? error.message : 'Unknown error occurred'}
					</p>
				</div>
			</div>
		)
	}
}


