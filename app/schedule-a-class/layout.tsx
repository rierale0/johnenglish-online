import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200','400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Agenda una clase',
  description: 'Clases de inglés online personalizadas para mejorar tu fluidez',
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
    <html lang="es" className={poppins.className}>
      <body>{children}</body>
    </html>
  )
}
