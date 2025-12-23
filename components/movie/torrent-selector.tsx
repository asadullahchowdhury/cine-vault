'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'
import type { YtsTorrent } from '@/lib/api/yts'
import { generateMagnetLink } from '@/lib/api/yts'
import { TorrentStreamPlayer } from './torrent-stream-player'

interface TorrentSelectorProps {
	torrents: YtsTorrent[]
	movieTitle: string
	onDownload?: (magnetLink: string, quality: string) => void
	onStream?: (magnetLink: string, quality: string) => void
}

export function TorrentSelector({
	torrents,
	movieTitle,
	onDownload,
	onStream,
}: TorrentSelectorProps) {
	const [streamingTorrent, setStreamingTorrent] = useState<{
		magnetLink: string
		quality: string
	} | null>(null)

	if (!torrents || torrents.length === 0) {
		return (
			<div className="rounded-lg border p-4 text-center text-muted-foreground">
				No torrents available for this movie
			</div>
		)
	}

	// Sort torrents by quality (prefer higher quality)
	const sortedTorrents = [...torrents].sort((a, b) => {
		const qualityOrder: Record<string, number> = {
			'2160p': 4,
			'1080p': 3,
			'720p': 2,
			'480p': 1,
		}
		return (qualityOrder[b.quality] || 0) - (qualityOrder[a.quality] || 0)
	})

	const handleDownload = (torrent: YtsTorrent) => {
		const magnetLink = generateMagnetLink(torrent.hash, movieTitle)
		if (onDownload) {
			onDownload(magnetLink, torrent.quality)
		} else {
			// Default: open magnet link
			window.location.href = magnetLink
		}
	}

	const handleStream = (torrent: YtsTorrent) => {
		const magnetLink = generateMagnetLink(torrent.hash, movieTitle)
		if (onStream) {
			onStream(magnetLink, torrent.quality)
		} else {
			setStreamingTorrent({ magnetLink, quality: torrent.quality })
		}
	}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Available Qualities</h3>
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{sortedTorrents.map((torrent) => (
					<div
						key={torrent.hash}
						className="flex items-center justify-between rounded-lg border p-4"
					>
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<span className="font-semibold">{torrent.quality}</span>
								<span className="text-xs text-muted-foreground">
									{torrent.size}
								</span>
							</div>
							<div className="mt-1 flex gap-4 text-xs text-muted-foreground">
								<span>Seeds: {torrent.seeds}</span>
								<span>Peers: {torrent.peers}</span>
							</div>
						</div>
						<div className="flex gap-2">
							<Button
								size="sm"
								variant="outline"
								onClick={() => handleDownload(torrent)}
								title="Download torrent"
							>
								<Icon name="Download" className="h-4 w-4" />
							</Button>
							<Button
								size="sm"
								variant="default"
								onClick={() => handleStream(torrent)}
								title="Stream movie"
							>
								<Icon name="Play" className="h-4 w-4" />
							</Button>
						</div>
					</div>
				))}
			</div>
			{streamingTorrent && (
				<TorrentStreamPlayer
					magnetLink={streamingTorrent.magnetLink}
					movieTitle={movieTitle}
					quality={streamingTorrent.quality}
					isOpen={!!streamingTorrent}
					onClose={() => setStreamingTorrent(null)}
				/>
			)}
		</div>
	)
}

