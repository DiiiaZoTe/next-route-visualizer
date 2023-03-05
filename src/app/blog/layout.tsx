import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <h1>Blog layout</h1>
        {children}
      </body>
    </html> 
  );
}
