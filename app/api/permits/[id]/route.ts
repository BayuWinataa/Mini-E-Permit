import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

const statusSchema = z.object({
	status: z.enum(['APPROVED', 'REJECTED']),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
	const session = await getSession();
	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}
	if (session.role !== 'ADMIN') {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}

	const { id } = await context.params;
	const body = (await request.json()) as unknown;
	const parsed = statusSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: 'Input tidak valid' }, { status: 400 });
	}

	const updated = await prisma.permit.update({
		where: { id },
		data: { status: parsed.data.status },
	});

	return NextResponse.json({ data: updated });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
	const session = await getSession();
	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}
	if (session.role !== 'ADMIN') {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}

	const { id } = await context.params;

	await prisma.permit.delete({ where: { id } });

	return NextResponse.json({ success: true });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
	const session = await getSession();
	if (!session) {
		return NextResponse.redirect(new URL('/login', request.url));
	}
	if (session.role !== 'ADMIN') {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	const { id } = await context.params;
	const formData = await request.formData();
	const status = String(formData.get('status') ?? '');
	const parsed = statusSchema.safeParse({ status });
	if (!parsed.success) {
		return NextResponse.redirect(new URL('/admin/dashboard', request.url));
	}

	await prisma.permit.update({
		where: { id },
		data: { status: parsed.data.status },
	});

	return NextResponse.redirect(new URL('/admin/dashboard', request.url), 303);
}
