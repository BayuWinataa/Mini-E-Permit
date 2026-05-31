import { ShieldCheck, ClipboardList, CheckCircle } from 'lucide-react';

const features = [
	{
		icon: ClipboardList,
		title: 'Pengajuan Mudah',
		desc: 'Ajukan izin kerja kapan saja secara online. Isi judul, deskripsi, dan tanggal pelaksanaan dalam satu form sederhana.',
	},
	{
		icon: ShieldCheck,
		title: 'Kontrol Akses Berbasis Peran',
		desc: 'Sistem membedakan hak akses antara pengguna biasa dan admin. Setiap pihak hanya melihat dan melakukan apa yang menjadi tanggung jawabnya.',
	},
	{
		icon: CheckCircle,
		title: 'Persetujuan Real-time',
		desc: 'Admin dapat meninjau detail pengajuan dan memberikan keputusan — setujui atau tolak — langsung dari dashboard.',
	},
];

export function FeaturesSection() {
	return (
		<section className="border-t border-slate-100 bg-slate-50 px-6 py-16">
			<div className="mx-auto max-w-5xl">
				<h2 className="mb-10 text-center text-xl font-semibold text-slate-900">Fitur Utama</h2>
				<div className="grid gap-6 sm:grid-cols-3">
					{features.map((f) => (
						<div key={f.title} className="rounded-xl border border-slate-200 bg-white p-6">
							<div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-slate-100">
								<f.icon className="size-5 text-slate-700" />
							</div>
							<h3 className="mb-1.5 font-semibold text-slate-900">{f.title}</h3>
							<p className="text-sm leading-relaxed text-slate-600">{f.desc}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
