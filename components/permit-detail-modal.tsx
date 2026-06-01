'use client';

import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';

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
	const [loading, setLoading] = useState<'APPROVED' | 'REJECTED' | 'DELETE' | null>(null);
	const [confirmDelete, setConfirmDelete] = useState(false);

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

	async function handleDelete() {
		setLoading('DELETE');
		try {
			await axios.delete(`/api/permits/${permit.id}`);
			await queryClient.invalidateQueries({ queryKey: adminPermitsQueryKey });
			toast.success('Pengajuan berhasil dihapus');
			setOpen(false);
		} catch (err) {
			const message = err instanceof AxiosError ? ((err.response?.data as { error?: string })?.error ?? 'Terjadi kesalahan') : 'Terjadi kesalahan';
			toast.error('Gagal menghapus pengajuan', { description: message });
		} finally {
			setLoading(null);
			setConfirmDelete(false);
		}
	}

	function handleOpenChange(val: boolean) {
		setOpen(val);
		if (!val) setConfirmDelete(false);
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
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

					{confirmDelete && <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs text-destructive">Yakin ingin menghapus pengajuan ini? Tindakan tidak dapat dibatalkan.</div>}
				</div>

				<DialogFooter>
					{confirmDelete ? (
						<>
							<Button variant="outline" size="sm" disabled={loading === 'DELETE'} onClick={() => setConfirmDelete(false)}>
								Batal
							</Button>
							<Button variant="destructive" size="sm" disabled={loading === 'DELETE'} onClick={handleDelete}>
								{loading === 'DELETE' ? 'Menghapus...' : 'Ya, Hapus'}
							</Button>
						</>
					) : (
						<>
							<Button variant="destructive" size="sm" disabled={loading !== null} onClick={() => setConfirmDelete(true)} className="mr-auto">
								<Trash2 className="size-3.5" />
								Hapus
							</Button>

							{permit.status === 'PENDING' ? (
								<>
									<Button variant="outline" size="sm" disabled={loading !== null} onClick={() => handleAction('REJECTED')}>
										{loading === 'REJECTED' ? 'Memproses...' : 'Tolak'}
									</Button>
									<Button size="sm" disabled={loading !== null} onClick={() => handleAction('APPROVED')}>
										{loading === 'APPROVED' ? 'Memproses...' : 'Setujui'}
									</Button>
								</>
							) : (
								<Button variant="outline" size="sm" onClick={() => setOpen(false)}>
									Tutup
								</Button>
							)}
						</>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
