'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/cn'

export function Header() {
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
	const pathname = usePathname()

	const navLinks = [
		{ href: '/home', label: 'Home' },
		{ href: '/series', label: 'Series' },
		{ href: '/categories', label: 'Categories' },
		{ href: '/wishlist', label: 'Wishlist' },
	]

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<div className="flex items-center gap-6">
					<Link href="/home" className="flex items-center gap-2">
						<span className="text-2xl font-bold text-primary">CineVault</span>
					</Link>
					<nav className="hidden items-center gap-4 md:flex">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									'text-sm font-medium transition-colors hover:text-primary',
									pathname === link.href
										? 'text-primary'
										: 'text-muted-foreground'
								)}
							>
								{link.label}
							</Link>
						))}
					</nav>
				</div>

				<div className="flex items-center gap-2">
					{isSearchOpen ? (
						<div className="flex items-center gap-2">
							<Input
								type="search"
								placeholder="Search movies..."
								className="w-64"
								autoFocus
								onBlur={() => setIsSearchOpen(false)}
							/>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsSearchOpen(false)}
							>
								<Icon name="X" />
							</Button>
						</div>
					) : (
						<>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsSearchOpen(true)}
								className="hidden md:flex"
							>
								<Icon name="Search" />
							</Button>
							<Link href="/search">
								<Button
									variant="ghost"
									size="icon"
									className="md:hidden"
								>
									<Icon name="Search" />
								</Button>
							</Link>
						</>
					)}

					<div className="relative">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
						>
							<Icon name="User" />
						</Button>
						{isUserMenuOpen && (
							<div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-md border bg-popover p-1 shadow-md">
								<Link
									href="/wishlist"
									className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
									onClick={() => setIsUserMenuOpen(false)}
								>
									<Icon name="Heart" />
									Wishlist
								</Link>
								<button
									className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
									onClick={() => setIsUserMenuOpen(false)}
								>
									<Icon name="LogOut" />
									Logout
								</button>
							</div>
						)}
					</div>

					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					>
						{isMobileMenuOpen ? (
							<Icon name="X" />
						) : (
							<Icon name="Menu" />
						)}
					</Button>
				</div>
			</div>

			{(isMobileMenuOpen || isUserMenuOpen) && (
				<div
					className="fixed inset-0 z-40"
					onClick={() => {
						setIsMobileMenuOpen(false)
						setIsUserMenuOpen(false)
					}}
				/>
			)}
			{isMobileMenuOpen && (
				<nav className="border-t md:hidden">
					<div className="container mx-auto flex flex-col gap-2 px-4 py-4">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent',
									pathname === link.href
										? 'bg-accent text-primary'
										: 'text-muted-foreground'
								)}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{link.label}
							</Link>
						))}
					</div>
				</nav>
			)}
		</header>
	)
}

