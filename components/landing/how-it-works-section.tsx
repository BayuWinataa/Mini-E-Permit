const steps = [
	{ step: '01', title: 'Login ke sistem', desc: 'Masuk menggunakan akun yang telah terdaftar. Sistem akan mengenali peran Anda secara otomatis.' },
	{ step: '02', title: 'Ajukan izin kerja', desc: 'Pengguna mengisi form pengajuan dengan judul pekerjaan, deskripsi, dan tanggal pelaksanaan.' },
	{ step: '03', title: 'Admin meninjau', desc: 'Admin melihat semua pengajuan masuk, membuka detail, lalu memberikan keputusan setuju atau tolak.' },
	{ step: '04', title: 'Status diperbarui', desc: 'Pengguna dapat memantau status pengajuannya — Menunggu, Disetujui, atau Ditolak — dari dashboard.' },
];

export function HowItWorksSection() {
	return (
		<section className="px-6 py-16">
			<div className="mx-auto max-w-3xl">
				<h2 className="mb-10 text-center text-xl font-semibold text-slate-900">Cara Kerja</h2>
				<ol className="space-y-6">
					{steps.map((item) => (
						<li key={item.step} className="flex gap-5">
							<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">{item.step}</span>
							<div>
								<h3 className="font-semibold text-slate-900">{item.title}</h3>
								<p className="mt-0.5 text-sm leading-relaxed text-slate-600">{item.desc}</p>
							</div>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
