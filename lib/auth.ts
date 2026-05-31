import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const cookieName = 'ep_session';

function getJwtSecret() {
	const secret = process.env.AUTH_SECRET;
	if (!secret) {
		throw new Error('AUTH_SECRET is required');
	}
	return new TextEncoder().encode(secret);
}

export type SessionPayload = {
	userId: string;
	role: 'USER' | 'ADMIN';
};

export async function createSession(payload: SessionPayload) {
	const token = await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(getJwtSecret());

	const cookieStore = await cookies();
	cookieStore.set({
		name: cookieName,
		value: token,
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		path: '/',
		maxAge: 60 * 60 * 24 * 7,
	});
}

export async function getSession() {
	const cookieStore = await cookies();
	const token = cookieStore.get(cookieName)?.value;
	if (!token) return null;

	try {
		const { payload } = await jwtVerify(token, getJwtSecret());
		if (typeof payload.userId !== 'string' || typeof payload.role !== 'string') {
			return null;
		}
		return { userId: payload.userId, role: payload.role } as SessionPayload;
	} catch {
		return null;
	}
}

export async function clearSession() {
	const cookieStore = await cookies();
	cookieStore.set({
		name: cookieName,
		value: '',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		path: '/',
		maxAge: 0,
	});
}
