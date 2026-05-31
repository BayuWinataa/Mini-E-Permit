'use client';

import { usePermits } from '@/lib/hooks/use-permits';
import { PermitsTable } from '@/components/permits-table';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
	userName: string;
};

function TableSkeleton() {
	return (
		<div className="space-y-3">
			<Skeleton className="h-9 w-64" />

			<div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
				<table className="min-w-full divide-y divide-slate-200 text-sm">
					<thead className="bg-slate-50">
						<tr>
							{['Judul', 'Tanggal', 'Status', 'Dibuat', 'Aksi'].map((col) => (
								<th key={col} className="px-4 py-3 text-left">
									<Skeleton className="h-3.5 w-16" />
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{Array.from({ length: 5 }).map((_, i) => (
							<tr key={i}>
								<td className="px-4 py-3">
									<Skeleton className="h-4 w-40" />
								</td>
								<td className="px-4 py-3">
									<Skeleton className="h-4 w-24" />
								</td>
								<td className="px-4 py-3">
									<Skeleton className="h-6 w-20 rounded-full" />
								</td>
								<td className="px-4 py-3">
									<Skeleton className="h-4 w-24" />
								</td>
								<td className="px-4 py-3">
									<Skeleton className="h-7 w-24 rounded-lg" />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<Skeleton className="h-3.5 w-48" />
		</div>
	);
}

export function UserDashboard({ userName }: Props) {
	const { data, isLoading, isError } = usePermits();

	return (
		<div className="mx-auto w-full px-4 py-8">
			<div className="mb-6">
				<h1 className="text-2xl font-semibold text-slate-900">Welcome, {userName}</h1>
			</div>

			{isLoading ? <TableSkeleton /> : isError ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-600">Gagal memuat data. Silakan refresh halaman.</div> : <PermitsTable data={data ?? []} />}
		</div>
	);
}
