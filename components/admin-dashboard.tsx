'use client';

import { useAdminPermits } from '@/lib/hooks/use-admin-permits';
import { AdminPermitsTable, AdminTableSkeleton } from '@/components/admin-permits-table';

type Props = {
	adminName: string;
};

export function AdminDashboard({ adminName }: Props) {
	const { data, isLoading, isError } = useAdminPermits();

	return (
		<div className="mx-auto w-full px-4 py-8">
			<div className="mb-6">
				<h1 className="text-2xl font-semibold text-slate-900">Welcome {adminName}</h1>
			</div>

			{isLoading ? (
				<AdminTableSkeleton />
			) : isError ? (
				<div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-600">Gagal memuat data. Silakan refresh halaman.</div>
			) : (
				<AdminPermitsTable data={data ?? []} />
			)}
		</div>
	);
}
