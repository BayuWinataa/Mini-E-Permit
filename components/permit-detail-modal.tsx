'use client';

import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { adminPermitsQueryKey } from '@/lib/hooks/use-admin-permits';
import { STATUS_LABEL, STATUS_CLASS, type AdminPermitRow } from '@/types/permit';

type Props = {
	permit: AdminPermitRow;
};

export function PermitDetailModal({ permit }: Props) {
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState<'APPROVED' | 'REJECTED' | null>(null);

	async function handleAction(status: 'APPROVED' | 'REJECTED') {
		setLoading(status);
		try {
			await axios.patch(`/api/permits/${permit.id}`, { status }, { headers: { 'Content-Type': 'application/json' } });
			await queryClient.invalidateQueries({ queryKey: adminPermitsQueryKey });
			toast.success(status === 'APPROVED' ? 'Pengajuan disetujui' : 'Pengajuan ditolak');
			setOpen(false);
		} catch (err) {
			const message = err instanceof AxiosError ? ((err.response?.data as { error?: string })?.error ?? 'Terjadi kesalahan') : 'Terjadi kesalahan';
			toast.error('Gagal memperbarui status', { description: message });
		} finally {
			setLoading(null);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="inline-flex h-7 items-center justify-center rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium text-foreground transition-colors hover:bg-muted">
				Lihat Detail
			</DialogTrigger>

			<DialogContent className="flex max-h-[90vh] flex-col sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{permit.title}</DialogTitle>
					<DialogDescription>
						Detail pengajuan izin dari <span className="font-medium text-foreground">{permit.user.name}</span>
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-3 overflow-y-auto text-sm">
					<div className="grid grid-cols-3 gap-1">
						<span className="text-muted-foreground">Pemohon</span>
						<span className="col-span-2 font-medium">{permit.user.name}</span>
					</div>
					<div className="grid grid-cols-3 gap-1">
						<span className="text-muted-foreground">Email</span>
						<span className="col-span-2">{permit.user.email}</span>
					</div>
					<div className="grid grid-cols-3 gap-1">
						<span className="text-muted-foreground">Tanggal</span>
						<span className="col-span-2">{new Date(permit.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
					</div>
					<div className="grid grid-cols-3 gap-1">
						<span className="text-muted-foreground">Status</span>
						<span className="col-span-2">
							<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASS[permit.status]}`}>{STATUS_LABEL[permit.status]}</span>
						</span>
					</div>
					<div className="space-y-1">
						<span className="text-muted-foreground">Deskripsi</span>
						<p className="rounded-lg border bg-muted/40 px-3 py-2 leading-relaxed text-foreground">{permit.description}</p>
					</div>
				</div>

				{permit.status === 'PENDING' ? (
					<DialogFooter>
						<Button variant="destructive" size="sm" disabled={loading !== null} onClick={() => handleAction('REJECTED')}>
							{loading === 'REJECTED' ? 'Memproses...' : 'Tolak'}
						</Button>
						<Button size="sm" disabled={loading !== null} onClick={() => handleAction('APPROVED')}>
							{loading === 'APPROVED' ? 'Memproses...' : 'Setujui'}
						</Button>
					</DialogFooter>
				) : (
					<DialogFooter showCloseButton />
				)}
			</DialogContent>
		</Dialog>
	);
}
