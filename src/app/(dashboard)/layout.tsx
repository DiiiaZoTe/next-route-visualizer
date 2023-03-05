import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <h1>(dashboard layout)</h1>
        {children}
      </body>
    </html>
  );
}
