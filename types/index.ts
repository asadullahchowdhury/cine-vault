export interface User {
	id: number
	email: string
	name: string
	createdAt: Date
}

export interface WishlistItem {
	id: number
	userId: number
	movieId: number
	movieType: 'movie' | 'tv'
	createdAt: Date
}

export interface WatchProgress {
	id: number
	userId: number
	movieId: number
	movieType: 'movie' | 'tv'
	progress: number
	updatedAt: Date
}

export interface Movie {
	id: number
	title: string
	overview: string
	posterPath: string | null
	backdropPath: string | null
	releaseDate: string
	rating: number
	voteCount: number
	genreIds: number[]
	popularity: number
	type: 'movie' | 'tv'
}

export interface MovieDetails extends Movie {
	genres: Array<{ id: number; name: string }>
	runtime?: number
	budget?: number
	revenue?: number
	cast?: Array<{
		id: number
		name: string
		character: string
		profilePath: string | null
	}>
	crew?: Array<{
		id: number
		name: string
		job: string
		profilePath: string | null
	}>
	trailer?: {
		key: string
		type: string
		site: string
	}
	similar?: Movie[]
}


