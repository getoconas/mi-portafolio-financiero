import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      {/* El className de inter aplica la fuente a toda la app */}
      <body className={inter.className}>{children}</body>
    </html>
  );
}