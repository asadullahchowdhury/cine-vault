'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'
import type { YtsTorrent } from '@/lib/api/yts'
import { generateMagnetLink } from '@/lib/api/yts'
import { TorrentStreamPlayer } from './torrent-stream-player'
import { cn } from '@/utils/cn'

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
		// Try to download the .torrent file directly first
		if (torrent.url) {
			// Create a temporary anchor element to trigger download
			const link = document.createElement('a')
			link.href = torrent.url
			link.download = `${movieTitle.replace(/[^a-z0-9]/gi, '_')}_${torrent.quality}.torrent`
			link.target = '_blank'
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			
			// Also try to open magnet link as fallback
			setTimeout(() => {
				const magnetLink = generateMagnetLink(torrent.hash, movieTitle)
				window.open(magnetLink, '_blank')
			}, 100)
		} else {
			// Fallback to magnet link
			const magnetLink = generateMagnetLink(torrent.hash, movieTitle)
			if (onDownload) {
				onDownload(magnetLink, torrent.quality)
			} else {
				// Open magnet link in new tab/window
				window.open(magnetLink, '_blank')
			}
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
			<h3 className="text-xl font-semibold">Available Qualities</h3>
			<div className="flex flex-wrap gap-4">
				{sortedTorrents.map((torrent) => (
					<div
						key={torrent.hash}
						className={cn(
							'relative flex flex-col rounded-lg border border-border bg-card p-4',
							'min-w-[200px] flex-1 transition-all hover:border-primary/50 hover:shadow-md'
						)}
					>
						<div className="mb-3">
							<div className="mb-2 flex items-center justify-between">
								<span className="text-lg font-bold">{torrent.quality}</span>
								<span className="text-sm text-muted-foreground">
									{torrent.size}
								</span>
							</div>
							<div className="flex gap-4 text-xs text-muted-foreground">
								<span>Seeds: {torrent.seeds}</span>
								<span>Peers: {torrent.peers}</span>
							</div>
						</div>
						<div className="mt-auto flex gap-2">
							<Button
								size="sm"
								variant="outline"
								className="flex-1"
								onClick={() => handleDownload(torrent)}
								title="Download torrent file"
							>
								<Icon name="Download" className="h-4 w-4" />
							</Button>
							<Button
								size="sm"
								variant="default"
								className="flex-1 bg-primary"
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

