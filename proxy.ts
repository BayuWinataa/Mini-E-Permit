import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const cookieName = 'ep_session';

function getJwtSecret() {
	const secret = process.env.AUTH_SECRET;
	if (!secret) {
		throw new Error('AUTH_SECRET is required');
	}
	return new TextEncoder().encode(secret);
}

async function getSessionFromRequest(request: NextRequest) {
	const token = request.cookies.get(cookieName)?.value;
	if (!token) return null;

	try {
		const { payload } = await jwtVerify(token, getJwtSecret());
		if (typeof payload.userId !== 'string' || typeof payload.role !== 'string') {
			return null;
		}
		return { userId: payload.userId, role: payload.role } as {
			userId: string;
			role: 'USER' | 'ADMIN';
		};
	} catch {
		return null;
	}
}

export default async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (pathname.startsWith('/login')) {
		const session = await getSessionFromRequest(request);
		if (!session) return NextResponse.next();
		const redirectPath = session.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard';
		return NextResponse.redirect(new URL(redirectPath, request.url));
	}

	if (pathname.startsWith('/admin')) {
		const session = await getSessionFromRequest(request);
		if (!session) {
			return NextResponse.redirect(new URL('/login', request.url));
		}
		if (session.role !== 'ADMIN') {
			return NextResponse.redirect(new URL('/login', request.url));
		}
	}

	if (pathname.startsWith('/user')) {
		const session = await getSessionFromRequest(request);
		if (!session) {
			return NextResponse.redirect(new URL('/login', request.url));
		}
		if (session.role !== 'USER') {
			return NextResponse.redirect(new URL('/login', request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/admin/:path*', '/user/:path*', '/login'],
};
