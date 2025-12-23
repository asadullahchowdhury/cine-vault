import type { YtsMovie, YtsMovieDetails } from '@/lib/api/yts'

/**
 * Unified movie interface for YTS data
 */
export interface UnifiedMovie {
	id: number
	title: string
	overview: string | null
	poster_path: string | null
	backdrop_path: string | null
	release_date: string | null
	vote_average: number
	vote_count: number
	genre_ids: number[]
	genres?: Array<{ id: number; name: string }>
	popularity: number
	media_type: 'movie'
	year?: number
	runtime?: number
	imdb_code?: string
	torrents?: Array<{
		url: string
		hash: string
		quality: string
		size: string
		seeds: number
		peers: number
	}>
}

/**
 * Convert YTS movie to unified format
 */
export function ytsToUnified(ytsMovie: YtsMovie | YtsMovieDetails): UnifiedMovie {
	// Normalize YTS image URLs (they redirect from yts.mx to img.yts.mx)
	const normalizeYtsUrl = (url: string | null | undefined): string | null => {
		if (!url) return null
		if (url.includes('yts.mx/assets/images')) {
			return url.replace('yts.mx', 'img.yts.mx')
		}
		return url
	}

	return {
		id: ytsMovie.id,
		title: ytsMovie.title_english || ytsMovie.title,
		overview: ytsMovie.description_full || ytsMovie.summary || ytsMovie.synopsis || null,
		poster_path: normalizeYtsUrl(ytsMovie.large_cover_image || ytsMovie.medium_cover_image),
		backdrop_path: normalizeYtsUrl(ytsMovie.background_image_original || ytsMovie.background_image),
		release_date: ytsMovie.date_uploaded || null,
		vote_average: ytsMovie.rating,
		vote_count: 0, // YTS doesn't provide vote count
		genre_ids: [], // Will be mapped separately if needed
		genres: ytsMovie.genres?.map((name, index) => ({ id: index, name })) || [],
		popularity: 0, // YTS doesn't provide popularity
		media_type: 'movie',
		year: ytsMovie.year,
		runtime: ytsMovie.runtime,
		imdb_code: ytsMovie.imdb_code,
		torrents: ytsMovie.torrents?.map((torrent) => ({
			url: torrent.url,
			hash: torrent.hash,
			quality: torrent.quality,
			size: torrent.size,
			seeds: torrent.seeds,
			peers: torrent.peers,
		})),
	}
}


