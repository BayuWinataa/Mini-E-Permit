import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/login-form';
import { getSession } from '@/lib/auth';

export default async function LoginPage() {
	const session = await getSession();
	if (session) {
		redirect(session.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard');
	}

	return (
		<div className="min-h-screen bg-white/50 px-4 py-12">
			<div className="mx-auto flex w-full max-w-md flex-col gap-6">
				<div className="text-center">
					<h1 className="text-3xl font-semibold uppercase text-black">Mini E-Permit</h1>
				</div>
				<LoginForm />
			</div>
		</div>
	);
}
