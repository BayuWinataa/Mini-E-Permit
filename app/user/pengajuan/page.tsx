import { redirect } from 'next/navigation';
import { PengajuanForm } from '@/components/pengajuan-form';
import { getSession } from '@/lib/auth';

export default async function UserPengajuanPage() {
	const session = await getSession();
	if (!session || session.role !== 'USER') {
		redirect('/login');
	}

	return (
		<div className="mx-auto w-full  px-4 py-8">
			<div className="mb-6">
				<h1 className="text-2xl font-semibold text-slate-900">Pengajuan Izin</h1>
			</div>
			<PengajuanForm />
		</div>
	);
}
