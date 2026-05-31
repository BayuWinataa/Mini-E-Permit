import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col bg-white">
			<Navbar />
			<main className="flex flex-1 flex-col">{children}</main>
			<Footer />
		</div>
	);
}
