import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { AuthProvider } from "./(firebase auth)/context/AuthContext";
import FacebookPixel from "@/app/global-components/FacebookPixel";
import JsonLd from "@/app/global-components/JsonLd";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200','400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'English with John | Clases de inglés personalizadas online',
  description: 'Aprende inglés con clases online personalizadas para mejorar tu fluidez y confianza. Profesor nativo con más de 6 años de experiencia para todos los niveles.',
  generator: 'github.com/rierale0',
  keywords: ['clases de inglés', 'inglés online', 'profesor de inglés', 'aprender inglés', 'clases personalizadas', 'inglés para profesionales', 'inglés para niños'],
  authors: [{ name: 'John English Teacher' }],
  openGraph: {
    title: 'English with John | Clases de inglés personalizadas online',
    description: 'Aprende inglés con clases online personalizadas para mejorar tu fluidez y confianza. Profesor nativo con más de 6 años de experiencia.',
    url: 'https://johnenglish.online',
    siteName: 'English with John',
    images: [
      {
        url: '/home/hero-john-students.png',
        width: 1200,
        height: 630,
        alt: 'English with John - Clases de inglés personalizadas',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'English with John | Clases de inglés personalizadas',
    description: 'Aprende inglés con clases online personalizadas para mejorar tu fluidez y confianza.',
    images: ['/home/hero-john-students.png'],
  },
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
  
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "English with John",
    "description": "Clases de inglés online personalizadas para mejorar tu fluidez y confianza",
    "url": "https://johnenglish.online",
    "logo": "https://johnenglish.online/favicon.png",
    "sameAs": [
      // Add your social profiles here
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Spain"
    },
    "offers": {
      "@type": "Offer",
      "price": "16",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <html lang="es" className={poppins.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://johnenglish.online" />
        {/* JsonLd component should be in head */}
        <JsonLd data={jsonLdData} />
      </head>
      {FB_PIXEL_ID && <FacebookPixel pixelId={FB_PIXEL_ID} />}
      <body>
      <AuthProvider> 
        {children}
        </AuthProvider> 
        </body>
        
    </html>
  )
}
