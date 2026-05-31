import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AdminSidebar } from '@/components/admin-sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const session = await getSession();
	if (!session || session.role !== 'ADMIN') {
		redirect('/login');
	}

	const admin = await prisma.user.findUnique({
		where: { id: session.userId },
		select: { name: true, email: true },
	});

	return (
		<div className="flex h-screen flex-col lg:flex-row">
			<AdminSidebar adminName={admin?.name ?? admin?.email ?? 'Admin'} />
			<main className="flex-1 overflow-y-auto bg-background">{children}</main>
		</div>
	);
}
