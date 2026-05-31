import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin-dashboard';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function AdminDashboardPage() {
	const session = await getSession();
	if (!session || session.role !== 'ADMIN') {
		redirect('/login');
	}

	const admin = await prisma.user.findUnique({
		where: { id: session.userId },
		select: { name: true },
	});

	return <AdminDashboard adminName={admin?.name ?? 'Admin'} />;
}
