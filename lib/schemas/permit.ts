import { z } from 'zod';

export const createPermitSchema = z.object({
	title: z.string().min(1, 'Judul wajib diisi').max(120, 'Judul maksimal 120 karakter'),
	description: z.string().min(1, 'Deskripsi wajib diisi').max(1000, 'Deskripsi maksimal 1000 karakter'),
	date: z.string().min(1, 'Tanggal wajib diisi'),
});

export type CreatePermitInput = z.infer<typeof createPermitSchema>;
