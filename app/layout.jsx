import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      // className="dark [colorScheme:dark]"
    >
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
