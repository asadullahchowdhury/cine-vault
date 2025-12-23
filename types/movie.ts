import type { YtsMovie, YtsMovieDetails } from '@/lib/api/yts'
import type { TmdbMovie, TmdbMovieDetails, TmdbTvShow, TmdbTvDetails } from '@/lib/api/tmdb'

/**
 * Unified movie interface that works with both YTS and TMDB data
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
	media_type: 'movie' | 'tv'
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

/**
 * Convert TMDB movie to unified format
 */
export function tmdbMovieToUnified(tmdbMovie: TmdbMovie | TmdbMovieDetails): UnifiedMovie {
	return {
		id: tmdbMovie.id,
		title: tmdbMovie.title,
		overview: tmdbMovie.overview || null,
		poster_path: tmdbMovie.poster_path,
		backdrop_path: tmdbMovie.backdrop_path,
		release_date: tmdbMovie.release_date || null,
		vote_average: tmdbMovie.vote_average,
		vote_count: tmdbMovie.vote_count,
		genre_ids: tmdbMovie.genre_ids,
		genres: 'genres' in tmdbMovie ? tmdbMovie.genres : undefined,
		popularity: tmdbMovie.popularity,
		media_type: tmdbMovie.media_type || 'movie',
		year: tmdbMovie.release_date
			? new Date(tmdbMovie.release_date).getFullYear()
			: undefined,
		runtime: 'runtime' in tmdbMovie ? tmdbMovie.runtime : undefined,
	}
}

/**
 * Convert TMDB TV show to unified format
 */
export function tmdbTvToUnified(tmdbTv: TmdbTvShow | TmdbTvDetails): UnifiedMovie {
	return {
		id: tmdbTv.id,
		title: tmdbTv.name,
		overview: tmdbTv.overview || null,
		poster_path: tmdbTv.poster_path,
		backdrop_path: tmdbTv.backdrop_path,
		release_date: tmdbTv.first_air_date || null,
		vote_average: tmdbTv.vote_average,
		vote_count: tmdbTv.vote_count,
		genre_ids: tmdbTv.genre_ids,
		genres: 'genres' in tmdbTv ? tmdbTv.genres : undefined,
		popularity: tmdbTv.popularity,
		media_type: 'tv',
		year: tmdbTv.first_air_date
			? new Date(tmdbTv.first_air_date).getFullYear()
			: undefined,
	}
}

