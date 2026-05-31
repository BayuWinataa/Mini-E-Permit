import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSession } from '@/lib/auth';

export async function Navbar() {
	const session = await getSession();
	const dashboardHref = session ? (session.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard') : null;

	return (
		<header className="border-b border-slate-200 px-6 py-4">
			<div className="mx-auto flex max-w-5xl items-center justify-between">
				<div className="flex items-center gap-2.5">
					<div className="flex size-8 items-center justify-center rounded-lg bg-slate-900 text-white">
						<FileText className="size-4" />
					</div>
					<span className="text-base font-semibold text-slate-900">E-Permit</span>
				</div>
				<Link href={dashboardHref ?? '/login'}>
					<Button  size="sm">
						{dashboardHref ? 'Ke Dashboard' : 'Masuk'}
					</Button>
				</Link>
			</div>
		</header>
	);
}
