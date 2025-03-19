import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200','400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'English with John',
  description: 'Online English Classes',
  generator: 'github.com/rierale0',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={poppins.className}>
      <body>{children}</body>
    </html>
  )
}
