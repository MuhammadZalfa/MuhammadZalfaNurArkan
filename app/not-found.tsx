import Link from "next/link"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-9xl font-bold text-primary/20 select-none">404</h1>
      <h2 className="mt-[-2rem] text-2xl font-bold">Halaman Tidak Ditemukan</h2>
      <p className="mt-3 text-muted-foreground max-w-md leading-relaxed">
        Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25"
      >
        <Home className="h-4 w-4" /> Kembali ke Beranda
      </Link>
    </div>
  )
}
