import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FocusQuest - Gamified Productivity',
  description: 'Turn your work into an epic adventure',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}