'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, X, Menu, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [{ label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard }];

type NavBodyProps = {
	pathname: string;
	adminName: string;
	onNavClick: () => void;
};

function NavBody({ pathname, onNavClick }: NavBodyProps) {
	return (
		<div className="flex h-full flex-col">
			<nav className="flex-1 space-y-0.5 px-3 py-4">
				{navItems.map((item) => {
					const active = pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							onClick={onNavClick}
							className={cn(
								'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
								active ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
							)}
						>
							<item.icon className="size-4 shrink-0" />
							{item.label}
						</Link>
					);
				})}
			</nav>

			<div className="border-t border-sidebar-border px-4 py-4">
				<form method="post" action="/api/auth/logout">
					<Button type="submit" variant="logout" size="sm" className="w-full">
						Logout
					</Button>
				</form>
			</div>
		</div>
	);
}

type Props = {
	adminName: string;
};

export function AdminSidebar({ adminName }: Props) {
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<>
			<aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex sticky top-0 h-screen">
				<div className="flex flex-col gap-1 border-b border-sidebar-border px-5 py-4">
					<div className="flex items-center gap-2.5">
						<div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<FileText className="size-4" />
						</div>
						<span className="text-base font-semibold tracking-tight text-sidebar-foreground">E-Permit</span>
					</div>
				</div>
				<NavBody pathname={pathname} adminName={adminName} onNavClick={() => {}} />
			</aside>

			<div className="flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3 lg:hidden">
				<div className="flex items-center gap-2">
					<div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
						<FileText className="size-3.5" />
					</div>
					<span className="text-sm font-semibold text-sidebar-foreground">E-Permit</span>
				</div>
				<button onClick={() => setMobileOpen(true)} className="rounded-md p-1.5 text-sidebar-foreground hover:bg-sidebar-accent" aria-label="Buka menu">
					<Menu className="size-5" />
				</button>
			</div>

			{mobileOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />}

			<aside className={cn('fixed inset-y-0 right-0 z-50 flex w-64 flex-col bg-sidebar shadow-xl transition-transform duration-200 lg:hidden', mobileOpen ? 'translate-x-0' : 'translate-x-full')}>
				<div className="flex items-center justify-between border-b border-sidebar-border px-4 py-3">
					<span className="text-sm font-semibold text-sidebar-foreground">Menu</span>
					<button onClick={() => setMobileOpen(false)} className="rounded-md p-1.5 text-sidebar-foreground hover:bg-sidebar-accent" aria-label="Tutup menu">
						<X className="size-4" />
					</button>
				</div>
				<NavBody pathname={pathname} adminName={adminName} onNavClick={() => setMobileOpen(false)} />
			</aside>
		</>
	);
}
