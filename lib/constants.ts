export const SITE = {
  name: "ZALFA",
  title: "Zalfa Portfolio",
  description: "Full-stack Developer & UI/UX Designer",
  url: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000",
}

export const SOCIAL = {
  github: "https://github.com/MuhammadZalfa",
  linkedin: "https://www.linkedin.com/in/muhammad-zalfa-nur-arkan-a481a7317/",
  twitter: "https://twitter.com",
  email: "muhammadzalfanurarkan@gmail.com",
  whatsapp: "6285183152660",
}

export const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Portofolio", href: "/projects" },
  { label: "Tentang", href: "/about" },
  { label: "Kontak", href: "/contact" },
  { label: "Blog", href: "/blog" },
]

export const SERVICES = [
  {
    title: "Web Development",
    description: "Membangun aplikasi web modern dengan performa tinggi menggunakan Next.js, Laravel, dan teknologi terkini.",
    icon: "Globe",
  },
  {
    title: "UI/UX Design",
    description: "Merancang antarmuka yang intuitif dan pengalaman pengguna yang memukau dengan pendekatan human-centered design.",
    icon: "Palette",
  },
  {
    title: "Mobile App",
    description: "Mengembangkan aplikasi mobile cross-platform yang responsif dan powerful dengan React Native.",
    icon: "Smartphone",
  },
  {
    title: "Backend API",
    description: "Membangun RESTful API dan microservices yang skalabel menggunakan Node.js, Go, dan cloud services.",
    icon: "Server",
  },
]

export const WHATSAPP_MESSAGE = "Halo! Saya tertarik dengan layanan Anda."
