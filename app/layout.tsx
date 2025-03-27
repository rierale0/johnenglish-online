import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import FacebookPixel from "@/components/FacebookPixel";

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
  const FB_PIXEL_ID = process.env.FB_PIXEL_ID;

  return (
    <html lang="en" className={poppins.className}>
      <FacebookPixel pixelId={FB_PIXEL_ID} />
      <body>{children}</body>
    </html>
  )
}
