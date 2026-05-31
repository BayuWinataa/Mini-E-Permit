import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { loginSchema } from '@/lib/schemas/auth';

export async function POST(request: Request) {
	const contentType = request.headers.get('content-type') ?? '';
	const acceptHeader = request.headers.get('accept') ?? '';

	let body: unknown = {};
	if (contentType.includes('application/json')) {
		body = (await request.json()) as unknown;
	} else {
		const formData = await request.formData();
		body = {
			email: String(formData.get('email') ?? '').trim(),
			password: String(formData.get('password') ?? ''),
		};
	}

	const parsed = loginSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
	}

	const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
	if (!user) {
		return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
	}

	const isValid = await bcrypt.compare(parsed.data.password, user.password);
	if (!isValid) {
		return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
	}

	await createSession({ userId: user.id, role: user.role });

	const redirectPath = user.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard';

	if (contentType.includes('application/json') || acceptHeader.includes('application/json')) {
		return NextResponse.json({ redirectTo: redirectPath });
	}

	return NextResponse.redirect(new URL(redirectPath, request.url), 303);
}
