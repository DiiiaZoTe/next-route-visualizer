export default function Layout({
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
