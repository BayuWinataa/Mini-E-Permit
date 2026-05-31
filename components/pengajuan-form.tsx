'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { permitsQueryKey } from '@/lib/hooks/use-permits';
import { createPermitSchema, type CreatePermitInput } from '@/lib/schemas/permit';
import { Textarea } from './ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = createPermitSchema;
type FormValues = CreatePermitInput;

export function PengajuanForm() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [serverError, setServerError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
	});

	async function onSubmit(values: FormValues) {
		setServerError(null);
		try {
			await axios.post('/api/permits', values, {
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			});
			await queryClient.invalidateQueries({ queryKey: permitsQueryKey });
			toast.success('Pengajuan berhasil dikirim', {
				description: 'Pengajuan izin kamu sedang diproses oleh admin.',
			});
			router.push('/user/dashboard');
			router.refresh();
		} catch (err) {
			const message = err instanceof AxiosError ? ((err.response?.data as { error?: string })?.error ?? 'Terjadi kesalahan') : 'Terjadi kesalahan';
			setServerError(message);
			toast.error('Gagal mengirim pengajuan', { description: message });
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Form Pengajuan</CardTitle>
			</CardHeader>
			<CardContent>
				<form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
					<div className="space-y-1.5">
						<Label htmlFor="title">Judul Pekerjaan</Label>
						<Input id="title" placeholder="Contoh: Instalasi jaringan" aria-invalid={!!errors.title} {...register('title')} />
						{errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="description">Deskripsi</Label>
						<Textarea
							id="description"
							rows={4}
							placeholder="Jelaskan pekerjaan yang akan dilakukan"
							aria-invalid={!!errors.description}
							className="border-input placeholder:text-muted-foreground focus-visible:ring-ring/50 flex min-h-20 w-full rounded-lg border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
							{...register('description')}
						/>
						{errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="date">Tanggal Pelaksanaan</Label>
						<Input id="date" type="date" aria-invalid={!!errors.date} {...register('date')} />
						{errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
					</div>

					{serverError && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>}

					<Button type="submit" className="p-5 font-semibold" disabled={isSubmitting}>
						{isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan'}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
