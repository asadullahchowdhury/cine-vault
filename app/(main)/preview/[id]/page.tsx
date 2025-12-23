import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@/components/icons'
import { getTvDetails, getImageUrl } from '@/lib/api/tmdb'
import { getMovieDetails as getYtsMovieDetails, getMovieSuggestions } from '@/lib/api/yts'
import { getYtsImageUrl } from '@/lib/api/yts'
import { Button } from '@/components/ui/button'
import { GenreTags } from '@/components/movie/genre-tags'
import { MovieSlider } from '@/components/movie/movie-slider'
import { TrailerModal } from '@/components/movie/trailer-modal'
import { AddToWishlistButton } from '@/components/movie/add-to-wishlist-button'
import { TorrentSelector } from '@/components/movie/torrent-selector'
import { ytsToUnified } from '@/types/movie'

interface PreviewPageProps {
	params: Promise<{ id: string }>
	searchParams: Promise<{ type?: string }>
}

export default async function PreviewPage({
	params,
	searchParams,
}: PreviewPageProps) {
	const { id } = await params
	const { type = 'movie' } = await searchParams
	const movieId = parseInt(id, 10)

	if (isNaN(movieId)) {
		notFound()
	}

	let details: any
	let similarMovies: any[] = []
	let torrents: any[] = []

	try {
		if (type === 'tv') {
			details = await getTvDetails(movieId)
		} else {
			details = await getYtsMovieDetails(movieId)
			torrents = details.torrents || []
			try {
				const suggestions = await getMovieSuggestions(movieId)
				similarMovies = suggestions.map(ytsToUnified)
			} catch (err) {
				// Ignore suggestions error
			}
		}
	} catch (error) {
		notFound()
	}

	const backdropUrl =
		type === 'tv'
			? getImageUrl(details.backdrop_path, 'original', 'backdrop')
			: getYtsImageUrl(details.background_image_original || details.background_image, 'large')
	const posterUrl =
		type === 'tv'
			? getImageUrl(details.poster_path, 'w500', 'poster')
			: getYtsImageUrl(details.large_cover_image || details.medium_cover_image, 'large')
	const trailer =
		type === 'tv'
			? details.videos?.results?.find(
					(v: any) => v.type === 'Trailer' && v.site === 'YouTube'
			  )
			: details.yt_trailer_code
			  ? { key: details.yt_trailer_code, site: 'YouTube' }
			  : null
	const cast = type === 'tv' ? details.credits?.cast || [] : details.cast || []

	return (
		<div className="relative min-h-screen">
			{/* Hero Section */}
			<div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
				<Image
					src={backdropUrl}
					alt={details.title || details.name || details.title_english}
					fill
					className="object-cover"
					priority
					unoptimized={type === 'movie' && backdropUrl?.includes('yts.mx')}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
				<div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
			</div>

			{/* Content */}
			<div className="container relative -mt-32 mx-auto px-4 pb-12">
				<div className="flex flex-col gap-8 md:flex-row">
					{/* Poster */}
					<div className="flex-shrink-0">
						<div className="relative h-[450px] w-[300px] overflow-hidden rounded-lg shadow-2xl">
							<Image
								src={posterUrl}
								alt={details.title || details.name || details.title_english}
								fill
								className="object-cover"
								unoptimized={type === 'movie' && posterUrl?.includes('yts.mx')}
							/>
						</div>
					</div>

					{/* Details */}
					<div className="flex-1 space-y-6">
						<div>
							<h1 className="text-4xl font-bold md:text-5xl">
								{details.title || details.name || details.title_english}
							</h1>
							<div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
								<div className="flex items-center gap-1">
									<Icon name="Star" className="h-4 w-4 fill-yellow-400 text-yellow-400" />
									<span className="font-semibold text-foreground">
										{type === 'tv'
											? details.vote_average.toFixed(1)
											: details.rating?.toFixed(1) || 'N/A'}
									</span>
									{type === 'tv' && (
										<span>({details.vote_count} votes)</span>
									)}
								</div>
								{(details.release_date || details.first_air_date || details.year) && (
									<div className="flex items-center gap-1">
										<Icon name="Calendar" />
										{type === 'tv'
											? new Date(
													details.release_date || details.first_air_date
											  ).getFullYear()
											: details.year || new Date(details.date_uploaded).getFullYear()}
									</div>
								)}
								{details.runtime && (
									<div className="flex items-center gap-1">
										<Icon name="Clock" />
										{details.runtime} min
									</div>
								)}
							</div>
						</div>

						<GenreTags
							genres={
								type === 'tv'
									? details.genres || []
									: details.genres?.map((name: string, index: number) => ({
											id: index,
											name,
									  })) || []
							}
						/>

						<div>
							<h2 className="mb-2 text-xl font-semibold">Overview</h2>
							<p className="text-muted-foreground">
								{details.overview ||
									details.description_full ||
									details.summary ||
									details.synopsis ||
									'No description available.'}
							</p>
						</div>

						<div className="flex flex-wrap gap-4">
							{trailer && (
								<TrailerModal
									trailerKey={type === 'tv' ? trailer.key : trailer}
								/>
							)}
							<AddToWishlistButton
								movieId={movieId}
								movieType={type}
								title={details.title || details.name || details.title_english}
							/>
							{type === 'movie' && torrents && torrents.length > 0 && (
								<TorrentSelector
									torrents={torrents}
									movieTitle={details.title_english || details.title}
								/>
							)}
						</div>

						{cast.length > 0 && (
							<div>
								<h2 className="mb-4 text-xl font-semibold">Cast</h2>
								<div className="flex gap-4 overflow-x-auto pb-4">
									{cast.slice(0, 10).map((actor: any, index: number) => (
										<div
											key={actor.id || actor.imdb_code || index}
											className="min-w-[100px] text-center"
										>
											<div className="relative mb-2 h-24 w-24 overflow-hidden rounded-full">
												<Image
													src={
														type === 'tv'
															? getImageUrl(actor.profile_path, 'w200', 'profile')
															: getYtsImageUrl(
																	actor.url_small_image,
																	'small'
															  )
													}
													alt={actor.name}
													fill
													className="object-cover"
													unoptimized={type === 'movie'}
												/>
											</div>
											<p className="text-sm font-medium">{actor.name}</p>
											<p className="text-xs text-muted-foreground">
												{type === 'tv'
													? actor.character
													: actor.character_name || 'Actor'}
											</p>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Similar Movies */}
				{(type === 'tv'
					? details.similar?.results && details.similar.results.length > 0
					: similarMovies.length > 0) && (
					<div className="mt-12">
						<MovieSlider
							title={`Similar ${type === 'tv' ? 'Shows' : 'Movies'}`}
							movies={
								type === 'tv'
									? details.similar.results.slice(0, 20)
									: similarMovies.slice(0, 20)
							}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

