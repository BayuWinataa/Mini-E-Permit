import { redirect } from 'next/navigation';
import { UserDashboard } from '@/components/user-dashboard';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function UserDashboardPage() {
	const session = await getSession();
	if (!session || session.role !== 'USER') {
		redirect('/login');
	}

	const user = await prisma.user.findUnique({
		where: { id: session.userId },
		select: { name: true },
	});

	return <UserDashboard userName={user?.name ?? 'User'} />;
}
