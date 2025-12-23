import {
	getTrendingMovies,
	getTopRatedMovies,
	getLatestMovies,
} from '@/lib/api/yts'
import { ytsToUnified } from '@/types/movie'
import { MovieSlider } from '@/components/movie/movie-slider'

export default async function HomePage() {
	const [trending, topRated, latest] = await Promise.all([
		getTrendingMovies(20),
		getTopRatedMovies(20),
		getLatestMovies(20),
	])

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
}


