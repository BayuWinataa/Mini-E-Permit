import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { AdminPermitRow } from '@/types/permit';

type ApiResponse = {
	data: Array<
		AdminPermitRow & {
			user: { id: string; name: string; email: string; role: string };
		}
	>;
};

async function fetchAdminPermits(): Promise<AdminPermitRow[]> {
	const res = await axios.get<ApiResponse>('/api/permits', {
		headers: { Accept: 'application/json' },
	});
	return res.data.data.map((p) => ({
		id: p.id,
		title: p.title,
		description: p.description,
		date: p.date,
		status: p.status,
		createdAt: p.createdAt,
		user: { name: p.user.name, email: p.user.email },
	}));
}

export const adminPermitsQueryKey = ['admin-permits'] as const;

export function useAdminPermits() {
	return useQuery({
		queryKey: adminPermitsQueryKey,
		queryFn: fetchAdminPermits,
	});
}
