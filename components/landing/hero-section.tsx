import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSession } from '@/lib/auth';

export async function HeroSection() {
	const session = await getSession();
	const dashboardHref = session ? (session.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard') : null;

	return (
		<section className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
			<div className="mx-auto max-w-2xl">
				<h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Mini E-Permit</h1>
				<p className="mt-4 text-lg text-slate-600">Prototipe aplikasi web untuk mengelola pengajuan izin kerja secara digital. Dirancang dengan pemisahan hak akses yang jelas antara pengguna dan admin.</p>
				<div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
					<Link href={dashboardHref ?? '/login'}>
						<Button className="px-6">{dashboardHref ? 'Ke Dashboard' : 'Mulai Sekarang'}</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}
