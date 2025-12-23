'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface TorrentStreamPlayerProps {
	magnetLink: string
	movieTitle: string
	quality: string
	isOpen: boolean
	onClose: () => void
}

export function TorrentStreamPlayer({
	magnetLink,
	movieTitle,
	quality,
	isOpen,
	onClose,
}: TorrentStreamPlayerProps) {
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [progress, setProgress] = useState(0)
	const [isReady, setIsReady] = useState(false)
	const videoRef = useRef<HTMLVideoElement>(null)
	const clientRef = useRef<any>(null)

	useEffect(() => {
		if (!isOpen || !magnetLink) return

		let mounted = true

		const loadTorrent = async () => {
			try {
				// Dynamically import webtorrent to avoid SSR issues
				const WebTorrent = (await import('webtorrent')).default

				const client = new WebTorrent()
				clientRef.current = client

				setIsLoading(true)
				setError(null)

				client.add(magnetLink, (torrent) => {
					if (!mounted) return

					// Find the largest video file
					const file = torrent.files.find((f: any) =>
						f.name.endsWith('.mp4') || f.name.endsWith('.mkv') || f.name.endsWith('.webm')
					)

					if (!file) {
						setError('No video file found in torrent')
						setIsLoading(false)
						return
					}

					// Create a blob URL for the video
					file.createReadStream().on('data', () => {
						if (!mounted) return
						const progress = Math.round((torrent.progress * 100) / 1)
						setProgress(progress)
					})

					file.renderTo(videoRef.current!, (err: Error) => {
						if (!mounted) return
						if (err) {
							setError(err.message)
							setIsLoading(false)
							return
						}

						setIsLoading(false)
						setIsReady(true)
					})
				})

				client.on('error', (err: Error) => {
					if (!mounted) return
					setError(err.message || 'Failed to load torrent')
					setIsLoading(false)
				})
			} catch (err: any) {
				if (!mounted) return
				setError(
					err.message || 'WebTorrent is not supported in this browser. Please use download instead.'
				)
				setIsLoading(false)
			}
		}

		loadTorrent()

		return () => {
			mounted = false
			if (clientRef.current) {
				clientRef.current.destroy()
				clientRef.current = null
			}
		}
	}, [magnetLink, isOpen])

	const handleClose = () => {
		if (clientRef.current) {
			clientRef.current.destroy()
			clientRef.current = null
		}
		setIsLoading(true)
		setIsReady(false)
		setProgress(0)
		setError(null)
		onClose()
	}

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="max-w-6xl p-0">
				<DialogHeader className="p-6 pb-0">
					<DialogTitle>
						Streaming: {movieTitle} ({quality})
					</DialogTitle>
				</DialogHeader>
				<div className="relative aspect-video w-full bg-black">
					{isLoading && (
						<div className="absolute inset-0 flex flex-col items-center justify-center text-white">
							<div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
							<p className="text-lg">Loading torrent...</p>
							{progress > 0 && (
								<p className="mt-2 text-sm text-gray-300">
									Buffering: {progress}%
								</p>
							)}
						</div>
					)}
					{error && (
						<div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
							<Icon name="X" className="mb-4 h-12 w-12 text-red-500" />
							<p className="text-lg font-semibold">Error</p>
							<p className="mt-2 text-sm text-gray-300">{error}</p>
							<Button
								variant="outline"
								className="mt-4"
								onClick={handleClose}
							>
								Close
							</Button>
						</div>
					)}
					<video
						ref={videoRef}
						controls
						className="h-full w-full"
						style={{ display: isReady && !error ? 'block' : 'none' }}
					/>
				</div>
				{isReady && (
					<div className="p-4 text-center text-sm text-muted-foreground">
						<p>
							Streaming via WebTorrent. Download may be slow initially while
							buffering.
						</p>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}

