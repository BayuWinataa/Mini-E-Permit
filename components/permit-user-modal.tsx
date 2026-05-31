'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { STATUS_LABEL, STATUS_CLASS, type PermitRow } from '@/types/permit';

type Props = {
	permit: PermitRow;
};

export function PermitUserModal({ permit }: Props) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="inline-flex h-7 items-center justify-center rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium text-foreground transition-colors hover:bg-muted">
				Lihat Detail
			</DialogTrigger>

			<DialogContent className="flex max-h-[90vh] flex-col sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{permit.title}</DialogTitle>
				</DialogHeader>

				<div className="space-y-3 overflow-y-auto text-sm">
					<div className="grid grid-cols-3 gap-1">
						<span className="text-muted-foreground">Tanggal</span>
						<span className="col-span-2">{new Date(permit.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
					</div>
					<div className="grid grid-cols-3 gap-1">
						<span className="text-muted-foreground">Dibuat</span>
						<span className="col-span-2">{new Date(permit.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
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

				<DialogFooter showCloseButton />
			</DialogContent>
		</Dialog>
	);
}
