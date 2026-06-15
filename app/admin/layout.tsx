import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | Admin",
  },
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
