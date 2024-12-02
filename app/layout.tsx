import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from './components/Toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Pin Poster - SaaS Pinterest Scheduler',
  description: 'Schedule and manage your Pinterest posts with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

