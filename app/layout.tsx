import type { Metadata } from 'next';
import { Poppins, Geist } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/components/query-provider';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const poppins = Poppins({
	variable: '--font-poppins',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
	title: 'E-Permit',
	description: 'E-Permit application',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={cn('font-sans', geist.variable)}>
			<body className={`${poppins.variable} antialiased`}>
				<QueryProvider>{children}</QueryProvider>
				<Toaster richColors position="top-center" />
			</body>
		</html>
	);
}
