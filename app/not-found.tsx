import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
	return (
		<div className="container mx-auto flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4 py-12">
			<div className="text-center">
				<div className="mb-8 flex justify-center">
					<svg
						className="h-32 w-32 text-muted-foreground"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
						/>
					</svg>
				</div>
				<h1 className="mb-4 text-6xl font-bold">404</h1>
				<h2 className="mb-4 text-2xl font-semibold">Page Not Found</h2>
				<p className="mb-8 text-muted-foreground">
					The page you're looking for doesn't exist or has been moved.
				</p>
				<Link href="/home">
					<Button size="lg">
						<svg
							className="mr-2 h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
							/>
						</svg>
						Go Home
					</Button>
				</Link>
			</div>
		</div>
	)
}

