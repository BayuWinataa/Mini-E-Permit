export type PermitStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type PermitRow = {
	id: string;
	title: string;
	description: string;
	date: string;
	status: PermitStatus;
	createdAt: string;
};

export type AdminPermitRow = PermitRow & {
	user: {
		name: string;
		email: string;
	};
};

export const STATUS_LABEL: Record<PermitStatus, string> = {
	PENDING: 'Menunggu',
	APPROVED: 'Disetujui',
	REJECTED: 'Ditolak',
};

export const STATUS_CLASS: Record<PermitStatus, string> = {
	PENDING: 'bg-yellow-100 text-yellow-700',
	APPROVED: 'bg-green-100 text-green-700',
	REJECTED: 'bg-red-100 text-red-700',
};
