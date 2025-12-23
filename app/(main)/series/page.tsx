import {
	getTrendingTvShows,
	getTopRatedTvShows,
} from '@/lib/api/tmdb'
import { MovieSlider } from '@/components/movie/movie-slider'

export default async function SeriesPage() {
	const [trending, topRated] = await Promise.all([
		getTrendingTvShows('day'),
		getTopRatedTvShows(1),
	])

	return (
		<div className="container mx-auto space-y-12 px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">TV Series</h1>
				<p className="mt-2 text-muted-foreground">
					Discover the best TV shows and series
				</p>
			</div>
			<MovieSlider title="Trending Series" movies={trending.slice(0, 20)} />
			<MovieSlider
				title="Top Rated Series"
				movies={topRated.results.slice(0, 20)}
			/>
		</div>
	)
}



