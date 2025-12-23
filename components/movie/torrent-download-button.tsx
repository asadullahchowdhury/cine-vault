'use client'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'
import { generateMagnetLink } from '@/lib/api/yts'
import type { YtsTorrent } from '@/lib/api/yts'

interface TorrentDownloadButtonProps {
	torrent: YtsTorrent
	movieTitle: string
	variant?: 'default' | 'outline' | 'ghost'
	size?: 'sm' | 'md' | 'lg'
	className?: string
}

export function TorrentDownloadButton({
	torrent,
	movieTitle,
	variant = 'outline',
	size = 'lg',
	className,
}: TorrentDownloadButtonProps) {
	const handleDownload = () => {
		const magnetLink = generateMagnetLink(torrent.hash, movieTitle)
		window.location.href = magnetLink
	}

	return (
		<Button
			variant={variant}
			size={size}
			onClick={handleDownload}
			className={className}
		>
			<Icon name="Download" className="mr-2 h-4 w-4" />
			Download {torrent.quality} ({torrent.size})
		</Button>
	)
}

