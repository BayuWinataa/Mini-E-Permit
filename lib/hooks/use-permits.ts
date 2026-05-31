import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { PermitRow } from '@/types/permit';

type ApiResponse = {
	data: PermitRow[];
};

async function fetchPermits(): Promise<PermitRow[]> {
	const res = await axios.get<ApiResponse>('/api/permits', {
		headers: { Accept: 'application/json' },
	});
	return res.data.data;
}

export const permitsQueryKey = ['permits'] as const;

export function usePermits() {
	return useQuery({
		queryKey: permitsQueryKey,
		queryFn: fetchPermits,
	});
}
