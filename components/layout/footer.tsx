import Link from 'next/link'
import { Icon } from '@/components/icons'

export function Footer() {
	return (
		<footer className="border-t bg-background">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">CineVault</h3>
						<p className="text-sm text-muted-foreground">
							Your ultimate destination for discovering and exploring movies.
						</p>
					</div>
					<div className="space-y-4">
						<h4 className="text-sm font-semibold">Navigation</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/home"
									className="text-muted-foreground transition-colors hover:text-foreground"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									href="/categories"
									className="text-muted-foreground transition-colors hover:text-foreground"
								>
									Categories
								</Link>
							</li>
							<li>
								<Link
									href="/search"
									className="text-muted-foreground transition-colors hover:text-foreground"
								>
									Search
								</Link>
							</li>
						</ul>
					</div>
					<div className="space-y-4">
						<h4 className="text-sm font-semibold">Legal</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/privacy"
									className="text-muted-foreground transition-colors hover:text-foreground"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="text-muted-foreground transition-colors hover:text-foreground"
								>
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>
					<div className="space-y-4">
						<h4 className="text-sm font-semibold">Connect</h4>
						<div className="flex gap-4">
							<Link
								href="https://github.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground transition-colors hover:text-foreground"
							>
								<Icon name="Github" className="h-5 w-5" />
							</Link>
							<Link
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground transition-colors hover:text-foreground"
							>
								<Icon name="Twitter" className="h-5 w-5" />
							</Link>
							<Link
								href="https://youtube.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground transition-colors hover:text-foreground"
							>
								<Icon name="Youtube" className="h-5 w-5" />
							</Link>
						</div>
					</div>
				</div>
				<div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
					<p>&copy; {new Date().getFullYear()} CineVault. All rights reserved.</p>
				</div>
			</div>
		</footer>
	)
}

