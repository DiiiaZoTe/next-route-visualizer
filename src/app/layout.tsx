import './globals.css'

export const metadata = {
  title: 'Next Route Visualizer',
  description: 'Visualize your Next.js routes in a tree structure',
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
