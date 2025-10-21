import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BSC Explorer - Easy to Read BSC Blockchain Explorer',
  description: 'Professional BSC transaction analysis with DeFi detection, educational content, and real-time monitoring. Built for the BSC ecosystem.',
  keywords: 'BSC, BNB, blockchain, explorer, transaction, DeFi, PancakeSwap, education, web3',
  authors: [{ name: 'BSC Explorer Team' }],
  openGraph: {
    title: 'BSC Explorer - Easy to Read BSC Blockchain Explorer',
    description: 'Professional BSC transaction analysis with DeFi detection and educational content.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
