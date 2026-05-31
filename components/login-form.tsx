'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginInput } from '@/lib/schemas/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = loginSchema;
type FormValues = LoginInput;

export function LoginForm() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
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
			const res = await axios.post<{ redirectTo?: string }>('/api/auth/login', values, { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } });
			toast.success('Login berhasil');
			const redirectTo = res.data?.redirectTo ?? '/user/dashboard';
			router.push(redirectTo);
		} catch (err) {
			const message = err instanceof AxiosError ? ((err.response?.data as { error?: string })?.error ?? 'Terjadi kesalahan') : 'Terjadi kesalahan';
			setServerError(message);
			toast.error('Login gagal', { description: message });
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-center text-2xl">Login</CardTitle>
			</CardHeader>
			<CardContent>
				<form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
					<div className="space-y-1.5">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" placeholder="nama@contoh.com" autoComplete="email" aria-invalid={!!errors.email} {...register('email')} />
						{errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="password">Password</Label>
						<div className="relative">
							<Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Masukkan password" autoComplete="current-password" aria-invalid={!!errors.password} className="pr-10" {...register('password')} />
							<button
								type="button"
								onClick={() => setShowPassword((v) => !v)}
								className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
								aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
							>
								{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
							</button>
						</div>
						{errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
					</div>

					{serverError && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>}

					<Button type="submit" className="w-full" disabled={isSubmitting}>
						{isSubmitting ? 'Memproses...' : 'Masuk'}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
