'use client'

import { Inter } from 'next/font/google'
import { ApolloWrapper } from '@/lib/apollo-provider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
            {children}
        </ApolloWrapper>
      </body>
    </html>
  )
}