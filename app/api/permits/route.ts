import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createPermitSchema } from '@/lib/schemas/permit';

export async function GET() {
	const session = await getSession();
	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (session.role === 'ADMIN') {
		const permits = await prisma.permit.findMany({
			orderBy: { createdAt: 'desc' },
			include: {
				user: {
					select: { id: true, name: true, email: true, role: true },
				},
			},
		});
		return NextResponse.json({ data: permits });
	}

	const permits = await prisma.permit.findMany({
		where: { userId: session.userId },
		orderBy: { createdAt: 'desc' },
	});

	return NextResponse.json({ data: permits });
}

export async function POST(request: Request) {
	const session = await getSession();
	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}
	if (session.role !== 'USER') {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}

	let body: unknown = {};
	const expectsJson = (request.headers.get('accept') ?? '').includes('application/json');
	const contentType = request.headers.get('content-type') ?? '';
	if (contentType.includes('application/json')) {
		body = (await request.json()) as unknown;
	} else {
		const formData = await request.formData();
		body = {
			title: String(formData.get('title') ?? ''),
			description: String(formData.get('description') ?? ''),
			date: String(formData.get('date') ?? ''),
		};
	}
	const parsed = createPermitSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: 'Input tidak valid' }, { status: 400 });
	}

	const date = new Date(parsed.data.date);
	if (Number.isNaN(date.getTime())) {
		return NextResponse.json({ error: 'Tanggal tidak valid' }, { status: 400 });
	}

	const permit = await prisma.permit.create({
		data: {
			title: parsed.data.title,
			description: parsed.data.description,
			date,
			userId: session.userId,
		},
	});

	if (contentType.includes('application/json') || expectsJson) {
		return NextResponse.json({ data: permit }, { status: 201 });
	}

	return NextResponse.redirect(new URL('/user/dashboard', request.url), 303);
}
