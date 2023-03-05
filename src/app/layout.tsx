import './globals.css'

export const metadata = {
  title: "Next Route Visualizer",
  description: "Visualize your Next.js routes in a tree structure",
  keywords: ["Next.js", "Route", "Visualizer"],
  openGraph: {
    title: "Next Route Visualizer",
    description: "Visualize your Next.js routes in a tree structure",
    url: "https://next-route-visualizer.vercel.app",
    images: [
      {
        url: "https://next-route-visualizer.vercel.app/og-image.png",
        width: 1280,
        height: 640,
      },
    ],
    locale: "en-US",
    type: "website",
  },
};

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
