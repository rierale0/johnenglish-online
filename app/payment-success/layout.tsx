import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200','400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Gracias por tu compra',
  description: 'Gracias por tu compra',
  generator: 'github.com/rierale0',
  icons: {
    icon: '/favicon.png',
  },
}

export default function PaymentSuccessLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={poppins.className}>
      {children}
    </div>
  )
}
