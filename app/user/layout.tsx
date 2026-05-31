import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { UserSidebar } from '@/components/user-sidebar';

export default async function UserLayout({ children }: { children: React.ReactNode }) {
	const session = await getSession();
	if (!session || session.role !== 'USER') {
		redirect('/login');
	}

	const user = await prisma.user.findUnique({
		where: { id: session.userId },
		select: { name: true, email: true },
	});

	return (
		<div className="flex h-screen flex-col lg:flex-row">
			<UserSidebar userName={user?.name ?? user?.email ?? 'User'} />
			<main className="flex-1 overflow-y-auto bg-background">{children}</main>
		</div>
	);
}
