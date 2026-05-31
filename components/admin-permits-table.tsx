'use client';

import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender, createColumnHelper, type SortingState } from '@tanstack/react-table';
import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

import { PermitDetailModal } from '@/components/permit-detail-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { STATUS_LABEL, STATUS_CLASS, type AdminPermitRow } from '@/types/permit';

const PAGE_SIZE = 10;

const col = createColumnHelper<AdminPermitRow>();

const columns = [
	col.accessor('user', {
		id: 'pemohon',
		header: 'Pemohon',
		cell: (info) => <span className="font-medium text-slate-900">{info.getValue().name}</span>,
	}),
	col.accessor('title', {
		header: 'Judul',
		cell: (info) => info.getValue(),
	}),
	col.accessor('date', {
		header: 'Tanggal',
		cell: (info) =>
			new Date(info.getValue()).toLocaleDateString('id-ID', {
				day: '2-digit',
				month: 'short',
				year: 'numeric',
			}),
	}),
	col.accessor('status', {
		header: 'Status',
		cell: (info) => <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLASS[info.getValue()]}`}>{STATUS_LABEL[info.getValue()]}</span>,
	}),
	col.display({
		id: 'aksi',
		header: 'Aksi',
		cell: (info) => <PermitDetailModal permit={info.row.original} />,
	}),
];

export function AdminTableSkeleton() {
	return (
		<div className="space-y-3">
			<Skeleton className="h-9 w-64" />
			<div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
				<table className="min-w-full divide-y divide-slate-200 text-sm">
					<thead className="bg-slate-50">
						<tr>
							{['Pemohon', 'Judul', 'Tanggal', 'Status', 'Aksi'].map((col) => (
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
									<Skeleton className="h-4 w-28" />
								</td>
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

type Props = {
	data: AdminPermitRow[];
};

export function AdminPermitsTable({ data }: Props) {
	'use no memo';
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState('');

	const table = useReactTable({
		data,
		columns,
		state: { sorting, globalFilter },
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: { pagination: { pageSize: PAGE_SIZE } },
	});

	function handleSearch(value: string) {
		setGlobalFilter(value);
		table.setPageIndex(0);
	}

	const { pageIndex, pageSize } = table.getState().pagination;
	const totalFiltered = table.getFilteredRowModel().rows.length;
	const from = totalFiltered === 0 ? 0 : pageIndex * pageSize + 1;
	const to = Math.min((pageIndex + 1) * pageSize, totalFiltered);

	return (
		<div className="space-y-3">
			<Input placeholder="Cari pengajuan..." value={globalFilter} onChange={(e) => handleSearch(e.target.value)} className="max-w-xs" />

			<div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
				<table className="min-w-full divide-y divide-slate-200 text-sm">
					<thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
						{table.getHeaderGroups().map((hg) => (
							<tr key={hg.id}>
								{hg.headers.map((header) => {
									const canSort = header.column.getCanSort();
									const sorted = header.column.getIsSorted();
									return (
										<th key={header.id} className="px-4 py-3">
											{header.isPlaceholder ? null : (
												<button type="button" onClick={canSort ? header.column.getToggleSortingHandler() : undefined} className={canSort ? 'inline-flex items-center gap-1 hover:text-slate-800' : 'cursor-default'}>
													{flexRender(header.column.columnDef.header, header.getContext())}
													{canSort && <span className="text-slate-400">{sorted === 'asc' ? <ArrowUp className="size-3" /> : sorted === 'desc' ? <ArrowDown className="size-3" /> : <ArrowUpDown className="size-3" />}</span>}
												</button>
											)}
										</th>
									);
								})}
							</tr>
						))}
					</thead>
					<tbody className="divide-y divide-slate-100">
						{table.getRowModel().rows.length === 0 ? (
							<tr>
								<td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
									Tidak ada pengajuan yang ditemukan.
								</td>
							</tr>
						) : (
							table.getRowModel().rows.map((row) => (
								<tr key={row.id} className="transition-colors hover:bg-slate-50">
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className="px-4 py-3 text-slate-600">
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			<div className="flex items-center justify-between">
				<p className="text-xs text-slate-500">{totalFiltered === 0 ? 'Tidak ada data' : `Menampilkan ${from}–${to} dari ${totalFiltered} pengajuan`}</p>
				<div className="flex items-center gap-1">
					<Button variant="outline" size="icon-sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Halaman sebelumnya">
						<ChevronLeft className="size-4" />
					</Button>
					{Array.from({ length: table.getPageCount() }, (_, i) => (
						<button
							key={i}
							type="button"
							onClick={() => table.setPageIndex(i)}
							className={`flex size-7 items-center justify-center rounded-md text-xs font-medium transition-colors ${pageIndex === i ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
						>
							{i + 1}
						</button>
					))}
					<Button variant="outline" size="icon-sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Halaman berikutnya">
						<ChevronRight className="size-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
